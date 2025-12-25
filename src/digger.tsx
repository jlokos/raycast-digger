import { List } from "@raycast/api";
import { useEffect } from "react";
import { validateUrl } from "./utils/urlUtils";
import { useFetchSite } from "./hooks/useFetchSite";
import { Overview } from "./components/Overview";

interface Arguments {
  url: string;
}

export default function Command(props: { arguments: Arguments }) {
  const { url: inputUrl } = props.arguments;
  const { data, isLoading, error, fetchSite } = useFetchSite(inputUrl);

  useEffect(() => {
    if (inputUrl) {
      if (!validateUrl(inputUrl)) {
        return;
      }
      fetchSite(inputUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputUrl]);

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
          <Overview data={data} />
        </List.Section>
      )}

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
