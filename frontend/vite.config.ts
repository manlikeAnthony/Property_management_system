import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const viteApiUrl = env.VITE_API_URL;

  // If VITE_API_URL is an absolute URL, set up dev proxy to backend origin
  const server: Record<string, any> = { port: 5173, open: false };
  if (viteApiUrl && /^https?:\/\//.test(viteApiUrl)) {
    try {
      const url = new URL(viteApiUrl);
      server.proxy = {
        // proxy any /api requests to the backend origin
        "/api": {
          target: url.origin,
          changeOrigin: true,
          secure: false,
        },
      };
    } catch (e) {
      // ignore invalid URL and don't configure proxy
    }
  }

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server,
  });
};
