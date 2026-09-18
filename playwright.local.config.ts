import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';
config({ path: '.env.local' });
if (
	process.env.DATABASE_URL !==
	'postgresql://demo:local-demo-only@127.0.0.1:5193/tofu_vocab'
)
	throw new Error('Local tests require the disposable compose database.');
export default defineConfig({
	testDir: './__e2e__/recovery',
	workers: 1,
	retries: 0,
	timeout: 60000,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:5192',
		channel: process.env.CI ? undefined : 'chrome',
		screenshot: 'only-on-failure',
	},
	webServer: {
		command: 'yarn dev --hostname 127.0.0.1 --port 5192',
		url: 'http://127.0.0.1:5192',
		reuseExistingServer: true,
	},
});
