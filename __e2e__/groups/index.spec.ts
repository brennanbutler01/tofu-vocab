import { test, expect } from '@playwright/test';
test('go to study group page', async ({ page }) => {
	await page.goto('/studyGroups');
	await expect(page.locator('h1')).toBeVisible();
});
