import { List, Icon } from "@raycast/api";
import { DiggerResult } from "../types";
import { Actions } from "../actions";
import { CertificateInfo } from "../utils/dnsUtils";

interface DNSCertificatesProps {
  data: DiggerResult;
  onRefresh: () => void;
  certificateInfo?: CertificateInfo | null;
}

export function DNSCertificates({ data, onRefresh, certificateInfo }: DNSCertificatesProps) {
  const { dns } = data;

  const dnsSection = dns
    ? `
## DNS Records

### A Records (IPv4)
${dns.aRecords && dns.aRecords.length > 0 ? dns.aRecords.map((ip) => `- ${ip}`).join("\n") : "*No A records found*"}

### AAAA Records (IPv6)
${dns.aaaaRecords && dns.aaaaRecords.length > 0 ? dns.aaaaRecords.map((ip) => `- ${ip}`).join("\n") : "*No AAAA records found*"}

### CNAME Record
${dns.cnameRecord ? `- ${dns.cnameRecord}` : "*No CNAME record found*"}

### MX Records (Mail Exchange)
${
  dns.mxRecords && dns.mxRecords.length > 0
    ? dns.mxRecords.map((mx) => `- **Priority ${mx.priority}**: ${mx.exchange}`).join("\n")
    : "*No MX records found*"
}

### TXT Records
${
  dns.txtRecords && dns.txtRecords.length > 0
    ? dns.txtRecords.map((txt) => `- \`${txt}\``).join("\n")
    : "*No TXT records found*"
}

### NS Records (Name Servers)
${dns.nsRecords && dns.nsRecords.length > 0 ? dns.nsRecords.map((ns) => `- ${ns}`).join("\n") : "*No NS records found*"}
`
    : "*DNS lookup not performed*";

  const getCertificateStatus = (daysUntilExpiry?: number): string => {
    if (daysUntilExpiry === undefined) return "";
    if (daysUntilExpiry < 0) return "🔴 **EXPIRED**";
    if (daysUntilExpiry < 30) return "🟡 **Expiring Soon**";
    return "🟢 **Valid**";
  };

  const certificateSection = certificateInfo
    ? `
## TLS Certificate

${getCertificateStatus(certificateInfo.daysUntilExpiry)}

### Certificate Details

- **Subject**: ${certificateInfo.subject || "N/A"}
- **Issuer**: ${certificateInfo.issuer || "N/A"}
- **Valid From**: ${certificateInfo.validFrom || "N/A"}
- **Valid To**: ${certificateInfo.validTo || "N/A"}
${certificateInfo.daysUntilExpiry !== undefined ? `- **Days Until Expiry**: ${certificateInfo.daysUntilExpiry}` : ""}

${
  certificateInfo.certificateChain && certificateInfo.certificateChain.length > 0
    ? `### Certificate Chain\n\n${certificateInfo.certificateChain.map((cert, idx) => `${idx + 1}. ${cert}`).join("\n")}`
    : ""
}
`
    : `
## TLS Certificate

*Certificate information not available*
`;

  const markdown = `
# DNS & Certificates

${dnsSection}

---

${certificateSection}
  `.trim();

  return (
    <List.Item
      title="DNS & Certificates"
      subtitle="DNS records and TLS certificate information"
      icon={Icon.Network}
      detail={<List.Item.Detail markdown={markdown} />}
      actions={<Actions data={data} url={data.url} onRefresh={onRefresh} />}
    />
  );
}
