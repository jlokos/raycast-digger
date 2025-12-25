import * as cheerio from "cheerio";

export function getMetaContent(html: string, name: string): string | undefined {
  const $ = cheerio.load(html);
  return $(`meta[name="${name}"]`).attr("content");
}

export function getMetaProperty(html: string, property: string): string | undefined {
  const $ = cheerio.load(html);
  return $(`meta[property="${property}"]`).attr("content");
}

export function getLinkHref(html: string, rel: string): string | undefined {
  const $ = cheerio.load(html);
  return $(`link[rel="${rel}"]`).attr("href");
}

export function getJsonLd(html: string): Array<Record<string, unknown>> {
  const $ = cheerio.load(html);
  const jsonLdScripts: Array<Record<string, unknown>> = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const content = $(element).html();
      if (content) {
        const parsed = JSON.parse(content);
        jsonLdScripts.push(parsed);
      }
    } catch {
      // Skip invalid JSON-LD
    }
  });

  return jsonLdScripts;
}

export function getAllMeta(html: string): Array<{ name?: string; property?: string; content?: string }> {
  const $ = cheerio.load(html);
  const metaTags: Array<{ name?: string; property?: string; content?: string }> = [];

  $("meta").each((_, element) => {
    const $meta = $(element);
    const name = $meta.attr("name");
    const property = $meta.attr("property");
    const content = $meta.attr("content");

    if ((name || property) && content) {
      metaTags.push({ name, property, content });
    }
  });

  return metaTags;
}
