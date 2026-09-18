import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './__e2e__/portfolio',
	workers: 1,
	retries: 0,
	timeout: 30000,
	reporter: 'list',
	use: {
		baseURL: process.env.PORTFOLIO_URL || 'http://127.0.0.1:5194',
		channel: 'chrome',
		screenshot: 'only-on-failure',
	},
	webServer: process.env.PORTFOLIO_URL
		? undefined
		: {
				command:
					'python3 -m http.server 5194 --bind 127.0.0.1 --directory portfolio-site/out',
				url: 'http://127.0.0.1:5194',
				reuseExistingServer: true,
		  },
});
