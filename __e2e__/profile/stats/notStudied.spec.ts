import { test, expect } from '@playwright/test';

test('notStudied', async ({ page }) => {
	await page.goto('/profile');
	await page.getByRole('tab', { name: 'Stats' }).click();

	const firstNavigationPromise = page.waitForNavigation();
	await page.locator('a[href="/stats/notStudied"]').click();
	await firstNavigationPromise;

	const navigationPromise = page.waitForNavigation();
	await page.getByRole('button', { name: /study these cards/i }).click();
	await navigationPromise;

	await expect(page.getByRole('heading', { name: /study/i })).toBeVisible();
});
