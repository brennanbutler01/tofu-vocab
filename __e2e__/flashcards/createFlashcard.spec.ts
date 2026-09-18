import { closeButtonLabel } from '@/components/flashcard/DuplicateAlert';
import { test, expect } from '@playwright/test';

test('can create a flashcard', async ({ page }) => {
	await page.goto('/flashcards');
	await page
		.getByRole('button', { name: 'create flashcard' })
		.first()
		.click();
	await page.getByRole('textbox', { name: 'front' }).first().fill('fronts');
	await page.getByRole('textbox', { name: 'back' }).first().fill('backs');
	await page.getByRole('button', { name: 'create' }).first().click();
	const alert = page.getByRole('alert', { name: /duplicate flashcard/i });

	if (await alert.isVisible()) {
		await page.screenshot({ path: 'alert.png' });
		await page.getByRole('button', { name: closeButtonLabel }).click();
		await page.getByRole('button', { name: 'create' }).first().click();
	}

	await page.waitForLoadState('networkidle');

	expect(await page.getByText('fronts').count()).toBeGreaterThanOrEqual(1);
	await page.screenshot({ path: 'created.png' });
});
