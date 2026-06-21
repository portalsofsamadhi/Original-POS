const SAME_ORIGIN_API_HOSTS = [
  "portalsofsamadhi.com",
  "www.portalsofsamadhi.com",
];

function isSameOriginApiHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return SAME_ORIGIN_API_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
}

/** Resolve API base URL for fetch calls. */
export function getApiBaseUrl(): string {
  // Production site serves /api on the same host; avoid stale cross-origin VITE_API_URL.
  if (typeof window !== "undefined" && isSameOriginApiHost(window.location.hostname)) {
    return "";
  }

  const configured = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!configured || configured === "/") {
    return "";
  }
  return configured.replace(/\/+$/, "");
}

/** Build a full API path, e.g. apiUrl('/api/send-email') */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}