import houdini from 'houdini/preprocess'
import path from 'path'
import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import watchAndRun from '@kitql/vite-plugin-watch-and-run'
import { HTTP_ENDPOINT } from './src/lib/config/env.js'
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$houdini: path.resolve('.', '$houdini'),
					$graphql: path.resolve('src', 'lib', 'graphql')
				}
			},
			server: {
				fs: {
					allow: ['.']
				},
				proxy: {
					'/graphql': HTTP_ENDPOINT,
					'/api': HTTP_ENDPOINT,
					'/images': HTTP_ENDPOINT
				}
			},
			plugins: [
				watchAndRun([
					{
						watch: '**/*.(gql|graphql)',
						run: 'npm run gen'
					}
				])
			]
		}
	},
	preprocess: [preprocess(), houdini()]
}

export default config
