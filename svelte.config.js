import adapterStatic from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapterStatic({
			fallback: "index.html"
		})
	},
	preprocess: vitePreprocess({
		scss: {
			includePaths: ['src']
		}
	})
};