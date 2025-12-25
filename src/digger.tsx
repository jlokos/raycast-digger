import { List, Clipboard, getPreferenceValues, getSelectedText, BrowserExtension } from "@raycast/api";
import { useEffect, useState } from "react";
import { validateUrl } from "./utils/urlUtils";
import { useFetchSite } from "./hooks/useFetchSite";
import { Overview } from "./components/Overview";
import { MetadataSemantics } from "./components/MetadataSemantics";
import { Discoverability } from "./components/Discoverability";
import { ResourcesAssets } from "./components/ResourcesAssets";

interface Arguments {
  url?: string;
}

export default function Command(props: { arguments: Arguments }) {
  const { url: inputUrl } = props.arguments;
  const preferences = getPreferenceValues<{
    autoLoadUrlFromClipboard: boolean;
    autoLoadUrlFromSelectedText: boolean;
    enableBrowserExtensionSupport: boolean;
  }>();
  const [url, setUrl] = useState<string | undefined>(inputUrl);
  const { data, isLoading, error, fetchSite, refetch } = useFetchSite(url);

  useEffect(() => {
    (async () => {
      let finalUrl = inputUrl;

      // If no URL provided, try auto-loading from various sources
      if (!finalUrl) {
        if (preferences.autoLoadUrlFromClipboard) {
          const clipboardText = await Clipboard.readText();
          if (clipboardText && validateUrl(clipboardText)) {
            finalUrl = clipboardText;
            setUrl(finalUrl);
            return;
          }
        }

        if (preferences.autoLoadUrlFromSelectedText) {
          try {
            const selectedText = await getSelectedText();
            if (selectedText && validateUrl(selectedText)) {
              finalUrl = selectedText;
              setUrl(finalUrl);
              return;
            }
          } catch {
            // Suppress the error if Raycast didn't find any selected text
          }
        }

        if (preferences.enableBrowserExtensionSupport) {
          try {
            const tabUrl = (await BrowserExtension.getTabs()).find((tab) => tab.active)?.url;
            if (tabUrl && validateUrl(tabUrl)) {
              finalUrl = tabUrl;
              setUrl(finalUrl);
              return;
            }
          } catch {
            // Suppress the error if Raycast didn't find browser extension
          }
        }
      }

      if (finalUrl && validateUrl(finalUrl)) {
        setUrl(finalUrl);
      }
    })();
  }, []);

  useEffect(() => {
    if (url && validateUrl(url)) {
      fetchSite(url);
    }
  }, [url]);

  if (error) {
    return (
      <List>
        <List.Item title="Error" subtitle={error} icon="⚠️" />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} isShowingDetail={true}>
      {data && (
        <List.Section title="Overview">
          <Overview data={data} onRefresh={refetch} />
        </List.Section>
      )}

      {data && (
        <List.Section title="Metadata">
          <MetadataSemantics data={data} onRefresh={refetch} />
        </List.Section>
      )}

      {data && (
        <List.Section title="Discoverability">
          <Discoverability data={data} onRefresh={refetch} />
        </List.Section>
      )}

      {data && (
        <List.Section title="Resources">
          <ResourcesAssets data={data} onRefresh={refetch} />
        </List.Section>
      )}

      <List.Section title="Networking">
        <List.Item
          title="Networking"
          subtitle="IP, Headers, Redirects"
          detail={<List.Item.Detail markdown="# Networking\n\n*Coming soon*" />}
        />
      </List.Section>

      <List.Section title="DNS">
        <List.Item
          title="DNS"
          subtitle="A, AAAA, MX, TXT Records"
          detail={<List.Item.Detail markdown="# DNS\n\n*Coming soon*" />}
        />
      </List.Section>

      <List.Section title="Performance">
        <List.Item
          title="Performance"
          subtitle="Load Time, TTFB, Page Size"
          detail={<List.Item.Detail markdown="# Performance\n\n*Coming soon*" />}
        />
      </List.Section>

      <List.Section title="History">
        <List.Item
          title="History"
          subtitle="Wayback Machine"
          detail={<List.Item.Detail markdown="# History\n\n*Coming soon*" />}
        />
      </List.Section>

      <List.Section title="Data Feeds">
        <List.Item
          title="Data Feeds"
          subtitle="RSS, Atom, JSON"
          detail={<List.Item.Detail markdown="# Data Feeds\n\n*Coming soon*" />}
        />
      </List.Section>
    </List>
  );
}
