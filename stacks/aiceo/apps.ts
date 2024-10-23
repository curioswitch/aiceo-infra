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
  }
}
