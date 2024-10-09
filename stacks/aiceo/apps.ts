import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import {
  type CurioStack,
  CurioStackService,
} from "@curioswitch/cdktf-constructs";
import { Construct } from "constructs";

export interface AppsConfig {
  project: string;
  githubAppId: number;

  curiostack: CurioStack;
}

export class Apps extends Construct {
  constructor(scope: Construct, config: AppsConfig) {
    super(scope, "apps");

    const frontendServer = new CurioStackService(this, {
      name: "frontend-server",
      public: true,
      curiostack: config.curiostack,
    });

    new ProjectIamMember(this, "frontend-server-firestore", {
      project: config.project,
      role: "roles/datastore.user",
      member: frontendServer.serviceAccount.member,
    });
  }
}
