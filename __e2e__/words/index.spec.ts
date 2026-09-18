import { test, expect } from '@playwright/test';

test('should display words page', async ({ page }) => {
	await page.goto('/words');

	await expect(
		page.getByRole('heading', { name: /discover new words/i }),
	).toBeVisible();

	//we can get new words
	await page.getByRole('button', { name: /fetch new word/i }).click();

	//we can use the new word to create a flashcard
	await page.getByRole('button', { name: /create flashcard/i }).click();
	await page.getByRole('button', { name: /create/i }).click();

	//we can see the flashcard
	await expect(page.getByText(/created flashcard/i)).toBeVisible();
});
