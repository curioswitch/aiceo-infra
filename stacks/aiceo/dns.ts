import type { GoogleFirebaseHostingCustomDomain } from "@cdktf/provider-google-beta/lib/google-firebase-hosting-custom-domain";
import { DataGoogleDnsManagedZone } from "@cdktf/provider-google/lib/data-google-dns-managed-zone/index.js";
import { DnsRecordSet } from "@cdktf/provider-google/lib/dns-record-set";
import { Fn } from "cdktf";
import { Construct } from "constructs";

export interface DnsConfig {
  project: string;
  domain: string;

  firebaseDomain: GoogleFirebaseHostingCustomDomain;
}

export class Dns extends Construct {
  constructor(scope: Construct, config: DnsConfig) {
    super(scope, "dns");

    const zone = new DataGoogleDnsManagedZone(this, "zone", {
      name: Fn.replace(config.domain, ".", "-"),
    });

    // Can't automatically provision due to https://github.com/hashicorp/terraform-provider-google/issues/16873
    // We also can't use the same configuration for dev and prod since root URLs have different settings.
    // Because this is technically temporary, assuming that gets fixed, we hackily branch on the domain rather
    // than parameterizing.
    if (config.domain === "alpha.aiceo.curioswitch.org") {
      // Need to get details from console since we use a subdomain zone, GCP rejects CNAME records, likely
      // incorrectly.
      new DnsRecordSet(this, "root-hosting-a", {
        managedZone: zone.name,
        name: zone.dnsName,
        type: "A",
        ttl: 300,
        rrdatas: ["199.36.158.100"],
      });
      new DnsRecordSet(this, "root-hosting-txt", {
        managedZone: zone.name,
        name: zone.dnsName,
        type: "TXT",
        ttl: 300,
        rrdatas: ["hosting-site=aiceo-dev"],
      });
      new DnsRecordSet(this, "root-hosting-acme-txt", {
        managedZone: zone.name,
        name: `_acme-challenge.${zone.dnsName}`,
        type: "TXT",
        ttl: 300,
        rrdatas: ["uLmcvtF4m0pHIbtyD95q_XizcklULkUIiqWslZ-F7cU"],
      });
    }

    if (config.domain === "aiceo.curioswitch.org") {
      new DnsRecordSet(this, "root-hosting-a", {
        managedZone: zone.name,
        name: zone.dnsName,
        type: "A",
        ttl: 300,
        rrdatas: ["199.36.158.100"],
      });
      new DnsRecordSet(this, "root-hosting-txt", {
        managedZone: zone.name,
        name: zone.dnsName,
        type: "TXT",
        ttl: 300,
        rrdatas: ["hosting-site=aiceo-prod"],
      });
      new DnsRecordSet(this, "root-hosting-acme-txt", {
        managedZone: zone.name,
        name: `_acme-challenge.${zone.dnsName}`,
        type: "TXT",
        ttl: 300,
        rrdatas: ["KuXbC2r_wBgKhlMGO3reacCsZU-nAh4qz_b6UdxUEYU"],
      });
    }
  }
}
