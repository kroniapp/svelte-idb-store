import adapterStatic from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";
import mm from "micromatch";

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapterStatic()
	},
	package: {
		dir: 'build',
		files: path => mm.isMatch(
			path,
			'**/(*.ts)'
		),
		exports: path => mm.isMatch(
			path,
			'index.ts'
		)
	},
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['src']
		}
	})
};