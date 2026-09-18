import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 320, height: 500 } });
test('page starts with the sidebar rendered', async ({ page }) => {
	await page.goto('/');

	await expect(
		page.getByRole('button', { name: 'burger-menu' }),
	).toBeVisible();
});
