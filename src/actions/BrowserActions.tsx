import { Action, Icon, Keyboard, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

interface Preferences {
  downloadPath: string;
}

interface BrowserActionsProps {
  url: string;
  html?: string;
}

export function BrowserActions({ url, html }: BrowserActionsProps) {
  const handleSavePage = async () => {
    if (!html) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No HTML Content",
        message: "HTML content is not available",
      });
      return;
    }

    try {
      const preferences = getPreferenceValues<Preferences>();
      const downloadPath = preferences.downloadPath.replace(/^~/, homedir());

      await mkdir(downloadPath, { recursive: true });

      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/[^a-z0-9]/gi, "_");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const filename = `${hostname}_${timestamp}.html`;
      const filepath = join(downloadPath, filename);

      await writeFile(filepath, html, "utf-8");

      await showToast({
        style: Toast.Style.Success,
        title: "Page Saved",
        message: `Saved to ${filepath}`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Save Page",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <Action.OpenInBrowser
        title="Open in Browser"
        url={url}
        icon={Icon.Globe}
        shortcut={Keyboard.Shortcut.Common.Open}
      />
      {html && (
        <Action
          title="Save Page"
          icon={Icon.Download}
          shortcut={{ modifiers: ["cmd"], key: "s" }}
          onAction={handleSavePage}
        />
      )}
    </>
  );
}
