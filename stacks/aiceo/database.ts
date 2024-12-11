import { FirestoreDatabase } from "@cdktf/provider-google/lib/firestore-database";
import { FirestoreIndex } from "@cdktf/provider-google/lib/firestore-index/index.js";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";
import { Construct } from "constructs";

export class Database extends Construct {
  constructor(scope: Construct) {
    super(scope, "database");

    const firestoreService = new ProjectService(this, "firestore", {
      service: "firestore.googleapis.com",
    });

    // We use (default) database to take advantage of free tier.
    const db = new FirestoreDatabase(this, "firestore-db", {
      name: "(default)",
      locationId: "asia-northeast1",
      type: "FIRESTORE_NATIVE",
      dependsOn: [firestoreService],
    });

    new FirestoreIndex(this, "chat-index", {
      database: db.name,
      collection: "chats",

      fields: [
        {
          fieldPath: "finished",
          order: "ASCENDING",
        },
        {
          fieldPath: "createdAt",
          order: "DESCENDING",
        },
      ],
    });
  }
}
