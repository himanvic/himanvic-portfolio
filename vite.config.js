import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/**
 * Injects SHA-384 Subresource Integrity (SRI) hashes onto compiled module scripts
 * and stylesheets in dist/index.html without adding third-party build plugins.
 */
function sriIntegrityPlugin() {
  let outDir = "dist";
  return {
    name: "vite-sri-integrity",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      let html = fs.readFileSync(indexPath, "utf8");

      const hashForAsset = (assetRelPath) => {
        const cleanRel = assetRelPath.replace(/^\/+/, "");
        const fullPath = path.join(outDir, cleanRel);
        if (!fs.existsSync(fullPath)) return null;
        const digest = crypto.createHash("sha384").update(fs.readFileSync(fullPath)).digest("base64");
        return `sha384-${digest}`;
      };

      html = html.replace(
        /<script\b([^>]*?)\bsrc="(\/assets\/[^"]+)"([^>]*)><\/script>/g,
        (match, before, src, after) => {
          if (match.includes("integrity=")) return match;
          const hash = hashForAsset(src);
          return hash ? `<script${before}src="${src}" integrity="${hash}" crossorigin="anonymous"${after}></script>` : match;
        }
      );

      html = html.replace(
        /<link\b([^>]*?)\bhref="(\/assets\/[^"]+\.(?:css|js))"([^>]*)>/g,
        (match, before, href, after) => {
          if (match.includes("integrity=")) return match;
          const hash = hashForAsset(href);
          return hash ? `<link${before}href="${href}" integrity="${hash}" crossorigin="anonymous"${after}>` : match;
        }
      );

      fs.writeFileSync(indexPath, html, "utf8");
    },
  };
}

export default defineConfig({
  plugins: [react(), sriIntegrityPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    historyApiFallback: true,
  },
  esbuild: {
    legalComments: "none",
    drop: ["debugger"],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
