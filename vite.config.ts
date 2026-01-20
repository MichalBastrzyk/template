import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    exclude: ["@tanstack/start-server-core"],
  },
  plugins: [devtools(), nitro({
    preset: "vercel",
    vercel: {
      config: {
        version: 3,
        images: {
          domains: ["images.unsplash.com"],
          sizes: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          minimumCacheTTL: 60 * 60,
          formats: ["image/avif", "image/webp"],
        
        }
      }
    }
  }), tanstackStart(), viteReact(), tailwindcss()],
});

export default config;
