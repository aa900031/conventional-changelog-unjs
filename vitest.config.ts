import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		dir: './lib',
		coverage: {
			provider: 'istanbul',
		},
	},
})
