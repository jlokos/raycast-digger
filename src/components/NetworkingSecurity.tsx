import { List, Icon } from "@raycast/api";
import { DiggerResult } from "../types";
import { Actions } from "../actions";

interface NetworkingSecurityProps {
  data: DiggerResult;
  onRefresh: () => void;
}

export function NetworkingSecurity({ data, onRefresh }: NetworkingSecurityProps) {
  const { networking } = data;
  const headers = networking?.headers || {};

  const httpHeaders = [
    { key: "server", label: "Server" },
    { key: "x-powered-by", label: "X-Powered-By" },
    { key: "cache-control", label: "Cache-Control" },
    { key: "etag", label: "ETag" },
    { key: "last-modified", label: "Last-Modified" },
  ];

  const securityHeaders = [
    { key: "content-security-policy", label: "Content-Security-Policy (CSP)" },
    { key: "strict-transport-security", label: "Strict-Transport-Security (HSTS)" },
    { key: "x-frame-options", label: "X-Frame-Options" },
    { key: "x-content-type-options", label: "X-Content-Type-Options" },
    { key: "x-xss-protection", label: "X-XSS-Protection" },
    { key: "referrer-policy", label: "Referrer-Policy" },
    { key: "permissions-policy", label: "Permissions-Policy" },
  ];

  const getHeaderValue = (key: string): string | undefined => {
    return headers[key] || headers[key.toLowerCase()];
  };

  const httpHeadersSection = httpHeaders
    .map(({ key, label }) => {
      const value = getHeaderValue(key);
      return value ? `- **${label}**: ${value}` : null;
    })
    .filter(Boolean)
    .join("\n");

  const securityHeadersSection = securityHeaders
    .map(({ key, label }) => {
      const value = getHeaderValue(key);
      const status = value ? "✓" : "✗";
      const statusColor = value ? "🟢" : "🔴";
      return `- ${statusColor} **${label}**: ${status} ${value ? `\n  \`${value}\`` : "Missing"}`;
    })
    .join("\n");

  const markdown = `
# Networking & Security

## HTTP Headers

${httpHeadersSection || "*No standard HTTP headers found*"}

---

## Security Headers

${securityHeadersSection}

---

## All Headers

${Object.entries(headers)
  .map(([key, value]) => `- **${key}**: \`${value}\``)
  .join("\n") || "*No headers available*"}
  `.trim();

  return (
    <List.Item
      title="Networking & Security"
      subtitle="HTTP headers and security analysis"
      icon={Icon.Lock}
      detail={<List.Item.Detail markdown={markdown} />}
      actions={<Actions data={data} url={data.url} onRefresh={onRefresh} />}
    />
  );
}
