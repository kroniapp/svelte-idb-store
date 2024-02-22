import {sveltekit} from "@sveltejs/kit/vite";
import type {UserConfig} from "vite";

export default {
  server: {
    port: 3004
  },
  plugins: [sveltekit()]
} as UserConfig;
