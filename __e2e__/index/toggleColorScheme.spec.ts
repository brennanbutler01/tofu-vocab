import { test, expect } from '@playwright/test';

test('should toggle color scheme', async ({ page }) => {
	await page.goto('/');
	await page
		.getByRole('button', {
			name: 'User Avatar John Doe htiengviet@gmail.com',
		})
		.click();
	await expect(page.getByRole('menu')).toBeVisible();
	await expect(page.getByText('light')).toBeVisible();
	await page.locator('button[name="color-scheme"]').click();
	await expect(page.getByText('dark')).toBeVisible();
	await page.screenshot({ path: 'screenshot.png' });
});
