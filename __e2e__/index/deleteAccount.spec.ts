import { test, expect } from '@playwright/test';

test('can cancel deleting account', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button').click();
	await expect(page.getByRole('menu')).toBeVisible();
	await page.waitForTimeout(1000);
	await page.screenshot({ path: 'screenshot.png' });
	await page.getByRole('menuitem', { name: /delete account/i }).click();
	await page.waitForTimeout(1000);
	await expect(
		page.getByText(
			'Are you sure that you really want to delete your account? It wont be possible to undo this action',
		),
	).toBeVisible();
	await page.waitForTimeout(1000);
	await page.screenshot({ path: 'screenshot1.png' });
	await expect(page.getByText('cancel')).toBeVisible();
	await page.getByText('cancel').click();
	await expect(page.getByText('cancelled')).toBeVisible();
});

// test('can delete account', async ({ page }) => {
// 	await page.goto('/');
// 	await page.getByRole('button').click();
// 	await expect(page.getByRole('menu')).toBeVisible();
// 	await page.waitForTimeout(1000);
// 	await page.screenshot({ path: 'screenshot.png' });
// 	await page.getByRole('menuitem', { name: /delete account/i }).click();
// 	await expect(
// 		page.getByText(
// 			'Are you sure that you really want to delete your account? It wont be possible to undo this action'
// 		)
// 	).toBeVisible();
// 	await expect(page.getByText('confirm')).toBeVisible();
// 	await page.waitForLoadState('networkidle');
// 	await page.screenshot({ path: 'screenshot3.png' });
// });
