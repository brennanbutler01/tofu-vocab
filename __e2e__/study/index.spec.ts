import { test, expect } from '@playwright/test';

test('page has title', async ({ page }) => {
	await page.goto('/study');
	await expect(page.getByRole('heading', { name: 'Study' })).toBeVisible();
});
