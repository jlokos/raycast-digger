export interface FetchResult {
  response: Response;
  status: number;
  headers: Record<string, string>;
  timing: number;
  finalUrl: string;
}

export async function fetchWithTimeout(url: string, timeout: number = 5000): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
    });

    const endTime = performance.now();
    const timing = endTime - startTime;

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      response,
      status: response.status,
      headers,
      timing,
      finalUrl: response.url,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
