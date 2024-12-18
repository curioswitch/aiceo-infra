import { ProjectIamCustomRole } from "@cdktf/provider-google/lib/project-iam-custom-role/index.js";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import {
  type CurioStack,
  CurioStackService,
} from "@curioswitch/cdktf-constructs";
import { Construct } from "constructs";

export interface AppsConfig {
  project: string;

  curiostack: CurioStack;
}

export class Apps extends Construct {
  constructor(scope: Construct, config: AppsConfig) {
    super(scope, "apps");

    const aiceoServer = new CurioStackService(this, {
      name: "aiceo-server",
      public: true,
      curiostack: config.curiostack,
    });

    new ProjectIamMember(this, "aiceo-server-firestore", {
      project: config.project,
      role: "roles/datastore.user",
      member: aiceoServer.serviceAccount.member,
    });

    const aiPredictor = new ProjectIamCustomRole(this, "ai-predictor", {
      project: config.project,
      roleId: "aiPredictor",
      title: "AI Predictor",
      description: "Permission to perform predictions with managed AI models.",
      permissions: [
        "aiplatform.endpoints.predict",
        "aiplatform.cachedContents.create",
      ],
    });

    new ProjectIamMember(this, "aiceo-server-vertexai", {
      project: config.project,
      role: aiPredictor.name,
      member: aiceoServer.serviceAccount.member,
    });
  }
}
