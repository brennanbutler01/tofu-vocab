import { test, expect } from '@playwright/test';

test('we should be able to edit the user', async ({ page }) => {
	await page.goto('/profile');
	await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
	await page.getByRole('button', { name: /edit/i }).click();
	await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
	await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
	await page.getByRole('button', { name: /confirm/i }).click();
	await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
	await expect(page.getByRole('textbox', { name: /name/i })).toHaveValue(
		'John Doe',
	);
});
