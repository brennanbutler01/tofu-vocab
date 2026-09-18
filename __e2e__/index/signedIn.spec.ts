import { test, expect } from '@playwright/test';

test('go to homepgae', async ({ page }) => {
	await page.goto('/');

	//we should have a welcome message
	await expect(
		page.getByRole('heading', { name: /welcome to tv/i }),
	).toBeVisible();

	//we should have a sign out button beecause we are already logged in
	await expect(page.getByRole('button')).toBeVisible();

	//we should have authenticated links
	await expect(
		page.getByRole('link', { name: 'Study' }).first(),
	).toBeVisible();
	await expect(
		page.getByRole('link', { name: 'Study groups' }),
	).toBeVisible();
	await expect(page.getByRole('link', { name: /flashcards/i })).toBeVisible();
});
