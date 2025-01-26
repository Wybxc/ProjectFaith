import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import unpluginTypia from "@ryoppippi/unplugin-typia/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    unpluginTypia({
      cache: true,
    }),
    tsconfigPaths(),
  ],
});
