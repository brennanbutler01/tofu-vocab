import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';
config({ path: '.env.local' });
export default defineConfig({
	testDir: './__e2e__/visitor',
	workers: 1,
	timeout: 90000,
	expect: { timeout: 15000 },
	use: {
		baseURL: process.env.VISITOR_URL || 'http://127.0.0.1:5214',
		channel: process.env.CI ? undefined : 'chrome',
	},
	webServer: process.env.VISITOR_URL
		? undefined
		: {
				command: 'yarn dev --hostname 127.0.0.1 --port 5214',
				url: 'http://127.0.0.1:5214',
				reuseExistingServer: false,
				env: {
					VISITOR_DEMO: 'true',
					NEXT_PUBLIC_VISITOR_DEMO: 'true',
					NEXTAUTH_URL: 'http://127.0.0.1:5214',
				},
			},
});
