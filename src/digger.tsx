import { List, ActionPanel, Action } from "@raycast/api";
import { useState, useEffect } from "react";
import { normalizeUrl, validateUrl } from "./utils/urlUtils";
import { useCache } from "./hooks/useCache";
import { DiggerResult } from "./types";

interface Arguments {
  url: string;
}

export default function Command(props: { arguments: Arguments }) {
  const { url: inputUrl } = props.arguments;
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DiggerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getFromCache, saveToCache } = useCache();

  useEffect(() => {
    if (inputUrl) {
      const processedUrl = normalizeUrl(inputUrl);
      setUrl(processedUrl);

      if (!validateUrl(processedUrl)) {
        setError("Invalid URL format");
        return;
      }

      fetchData(processedUrl);
    }
  }, [inputUrl]);

  const fetchData = async (targetUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const cached = await getFromCache(targetUrl);
      if (cached) {
        setData(cached);
        setIsLoading(false);
        return;
      }

      const result: DiggerResult = {
        url: targetUrl,
        fetchedAt: Date.now(),
      };

      setData(result);
      await saveToCache(targetUrl, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <List>
        <List.Item title="Error" subtitle={error} icon="⚠️" />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} isShowingDetail={true}>
      <List.Section title="Overview">
        <List.Item
          title="Website Overview"
          subtitle={url || "No URL provided"}
          detail={
            <List.Item.Detail
              markdown={`# Overview\n\nURL: ${url || "N/A"}\n\nFetched: ${data?.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : "N/A"}`}
            />
          }
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={url} />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Metadata">
        <List.Item
          title="Metadata"
          subtitle="Open Graph, Twitter Cards, JSON-LD"
          detail={<List.Item.Detail markdown="# Metadata\n\n*Coming soon*" />}
        />
      </List.Section>

      <List.Section title="Discoverability">
        <List.Item
          title="Discoverability"
          subtitle="Robots, Canonical, Sitemaps"
          detail={<List.Item.Detail markdown="# Discoverability\n\n*Coming soon*" />}
        />
      </List.Section>

      <List.Section title="Resources">
        <List.Item
          title="Resources"
          subtitle="Stylesheets, Scripts, Images"
          detail={<List.Item.Detail markdown="# Resources\n\n*Coming soon*" />}
        />
      </List.Section>

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
