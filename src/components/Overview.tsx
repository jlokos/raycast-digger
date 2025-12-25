import { List, Icon } from "@raycast/api";
import { DiggerResult } from "../types";

interface OverviewProps {
  data: DiggerResult;
}

export function Overview({ data }: OverviewProps) {
  const { overview, networking, performance } = data;

  const statusText = networking?.statusCode
    ? `${networking.statusCode} ${getStatusText(networking.statusCode)}`
    : "Unknown";

  const contentType = networking?.headers?.["content-type"] || "Unknown";
  const contentLength = networking?.headers?.["content-length"]
    ? formatBytes(parseInt(networking.headers["content-length"]))
    : "Unknown";

  const markdown = `
# ${overview?.title || "Untitled"}

${overview?.description || "*No description available*"}

---

## Response Details

- **Status**: ${statusText}
- **Final URL**: ${networking?.finalUrl || data.url}
- **Response Time**: ${performance?.loadTime ? `${Math.round(performance.loadTime)}ms` : "N/A"}
- **Content-Type**: ${contentType}
- **Content-Length**: ${contentLength}
- **Server**: ${networking?.server || "Unknown"}

${overview?.language ? `- **Language**: ${overview.language}` : ""}
${overview?.charset ? `- **Charset**: ${overview.charset}` : ""}

---

## Page Information

- **Title**: ${overview?.title || "N/A"}
- **Description**: ${overview?.description || "N/A"}
${performance?.pageSize ? `- **Page Size**: ${formatBytes(performance.pageSize)}` : ""}
  `.trim();

  return (
    <List.Item
      title="Overview"
      subtitle={overview?.title || data.url}
      icon={Icon.Globe}
      detail={<List.Item.Detail markdown={markdown} />}
    />
  );
}

function getStatusText(code: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  return statusTexts[code] || "Unknown";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
