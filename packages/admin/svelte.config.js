import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'ignore'
		}
	},
	compilerOptions: {
		customElement: true
	}
};

export default config;
