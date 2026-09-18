import { test, expect } from '@playwright/test';

test('should display profile page', async ({ page }) => {
	await page.goto('http://localhost:3000/profile');
	await expect(page).toHaveTitle(/your profile/i);
	await expect(page.getByRole('form')).toBeVisible();
});
