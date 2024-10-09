import { DataGoogleKmsSecret } from "@cdktf/provider-google/lib/data-google-kms-secret";
import { IdentityPlatformDefaultSupportedIdpConfig } from "@cdktf/provider-google/lib/identity-platform-default-supported-idp-config";
import { Construct } from "constructs";

export interface IdentityConfig {
  project: string;
  domain: string;
  googleAuthClientId: string;
  googleAuthClientSecretCiphertext: string;
}

export class Identity extends Construct {
  constructor(scope: Construct, config: IdentityConfig) {
    super(scope, "identity");

    const googleAuthClientSecret = new DataGoogleKmsSecret(
      this,
      "google-client-secret",
      {
        cryptoKey: `${config.project}/global/terraform/secrets`,
        ciphertext: config.googleAuthClientSecretCiphertext,
      },
    );

    new IdentityPlatformDefaultSupportedIdpConfig(this, "google-idp", {
      enabled: true,
      idpId: "google.com",
      clientId: config.googleAuthClientId,
      clientSecret: googleAuthClientSecret.plaintext,
    });
  }
}
