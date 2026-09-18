import { test, expect } from '@playwright/test';

test('page has title', async ({ page }) => {
	await page.goto('/flashcards');
	await expect(
		page.getByRole('heading', { name: 'Your Flashcards' }),
	).toBeVisible();
});
