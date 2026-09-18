import { test, expect } from '@playwright/test';

test('should display stats', async ({ page }) => {
	await page.goto('/profile');
	await page.getByRole('tab', { name: 'Stats' }).click();
	await expect(
		page.getByRole('heading', { name: /your stats/i }),
	).toBeVisible();
	await expect(page.getByText(/account age/i)).toBeVisible();
	await expect(page.getByText(/completed cards/i)).toBeVisible();
	await expect(page.getByText(/cards in progress/i)).toBeVisible();
	await expect(page.getByText(/cards not studied/i)).toBeVisible();
	await expect(page.getByText(/your best streak/i)).toBeVisible();
	await expect(page.getByText(/your current streak/i)).toBeVisible();
	await expect(
		page.getByRole('heading', { name: /activity/i }),
	).toBeVisible();
});
