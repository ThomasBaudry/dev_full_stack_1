import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const hstsEnabled = env.VITE_HSTS_MODE === "true";
  const maxAge = Number(env.VITE_HSTS_MAX_AGE || 31536000);
  const includeSubDomains = env.VITE_HSTS_INCLUDE_SUBDOMAINS !== "false";
  const preload = env.VITE_HSTS_PRELOAD === "true";

  const hstsValue = `max-age=${maxAge}${
    includeSubDomains ? "; includeSubDomains" : ""
  }${preload ? "; preload" : ""}`;

  const hstsHeaders = hstsEnabled
    ? { "Strict-Transport-Security": hstsValue }
    : {};

  return {
    server: {
      port: 3000,
      headers: hstsHeaders,
    },
    preview: {
      headers: hstsHeaders,
    },
  };
});
