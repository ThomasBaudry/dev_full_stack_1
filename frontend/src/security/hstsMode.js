const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const isLocalHostname = (hostname) =>
  LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith(".localhost");

/**
 * Enforce an HSTS-like mode on the frontend:
 * - verifies the current URL/host
 * - redirects to HTTPS when required
 *
 * Note: real HSTS is enforced by the browser from response headers.
 */
export const enforceHstsMode = () => {
  const enabled = import.meta.env.VITE_HSTS_MODE === "true";
  if (!enabled) return;

  const expectedHost = (import.meta.env.VITE_HSTS_EXPECTED_HOST || "").trim();
  const allowHttpOnLocal = import.meta.env.VITE_HSTS_ALLOW_HTTP_LOCAL !== "false";
  const { protocol, hostname, host, pathname, search, hash } = window.location;

  if (expectedHost && host !== expectedHost) {
    // URL verification hook: visible immediately in dev/prod logs.
    console.error(`[HSTS] Host mismatch: expected "${expectedHost}", got "${host}".`);
  }

  const isLocal = isLocalHostname(hostname);
  const isHttps = protocol === "https:";

  if (isHttps) return;
  if (allowHttpOnLocal && isLocal) {
    console.info("[HSTS] HTTP autorisé en local.");
    return;
  }

  const httpsUrl = `https://${host}${pathname}${search}${hash}`;
  window.location.replace(httpsUrl);
};

