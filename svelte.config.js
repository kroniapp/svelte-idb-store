import adapterStatic from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapterStatic({
			fallback: "index.html"
		})
	},
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['src']
		}
	})
};