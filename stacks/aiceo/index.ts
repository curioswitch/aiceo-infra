import { GoogleBetaProvider } from "@cdktf/provider-google-beta/lib/provider";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import { ProjectService } from "@cdktf/provider-google/lib/project-service/index.js";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { CurioStack } from "@curioswitch/cdktf-constructs";
import { GcsBackend, TerraformStack } from "cdktf";
import type { Construct } from "constructs";
import { Database } from "./database.js";
import { Dns } from "./dns.js";
import { Hosting } from "./hosting.js";
import { Identity } from "./identity.js";

export interface TasukeConfig {
  environment: string;
  project: string;
  domain: string;
  googleAuthClientId: string;
  googleAuthClientSecretCiphertext: string;
}

export class AiCeoStack extends TerraformStack {
  constructor(scope: Construct, config: TasukeConfig) {
    super(scope, config.environment);

    new GcsBackend(this, {
      bucket: `${config.project}-tfstate`,
    });

    new GoogleProvider(this, "google", {
      project: config.project,
      region: "asia-northeast1",
      userProjectOverride: true,
    });

    const googleBeta = new GoogleBetaProvider(this, "google-beta", {
      project: config.project,
      region: "asia-northeast1",
      userProjectOverride: true,
    });

    new RandomProvider(this, "random");

    const curiostack = new CurioStack(this, {
      project: config.project,
      location: "asia-northeast1",
      domain: config.domain,
      githubRepo: "curioswitch/aiceo",
      googleBeta,
    });

    new Database(this);

    // Even owner permission does not allow creating impersonation tokens.
    new ProjectIamMember(this, "sysadmin-token-creator", {
      project: config.project,
      role: "roles/iam.serviceAccountTokenCreator",
      member: "group:sysadmin@curioswitch.org",
    });

    const hosting = new Hosting(this, {
      project: config.project,
      domain: config.domain,
      githubRepoIamMember: curiostack.githubEnvironmentIamMember,
      googleBeta,
    });

    new Dns(this, {
      project: config.project,
      domain: config.domain,
      firebaseDomain: hosting.customDomain,
    });

    new Identity(this, {
      project: config.project,
      domain: config.domain,
      googleAuthClientId: config.googleAuthClientId,
      googleAuthClientSecretCiphertext: config.googleAuthClientSecretCiphertext,
    });

    new ProjectService(this, "aiplatform", {
      project: config.project,
      service: "aiplatform.googleapis.com",
    });
  }
}
