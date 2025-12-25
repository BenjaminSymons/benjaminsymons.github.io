import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const basePath = process.env.BASE_PATH ?? '';
const normalizedBasePath = basePath === '/' ? '' : basePath.replace(/\/$/, '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: normalizedBasePath
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html', // SPA-ish fallback for GH Pages
			precompress: false
		})
	}
};

export default config;
