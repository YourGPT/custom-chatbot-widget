import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                babelrc: true,
            },
        }),
        tsconfigPaths(),
    ],
    server: {
        port: 9999,
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "custom-widget.js",
                assetFileNames: "custom-widget.css",
                format: "iife",
            },
        },
    },
});
