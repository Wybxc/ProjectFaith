import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import TypiaPlugin from "@ryoppippi/unplugin-typia/rspack";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    proxy: {
      "/api": "http://localhost:3003",
    },
  },
  tools: {
    rspack: {
      plugins: [TypiaPlugin()],
    },
  },
});
