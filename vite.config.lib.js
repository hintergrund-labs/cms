import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		lib: {
			name: 'HgCms',
			entry: './src/lib/index.js',
			formats: ['es'],
			fileName: 'index'
		}
	},
	plugins: [
		svelte({
			compilerOptions: {
				customElement: true,
				css: 'injected',
				dev: false
			}
		})
	]
});
