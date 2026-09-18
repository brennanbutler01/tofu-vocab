import { closeButtonLabel } from '@/components/flashcard/DuplicateAlert';
import { test, expect } from '@playwright/test';

test('can create a study group', async ({ page }) => {
	await page.goto('/studyGroups');
	await page.getByRole('button', { name: 'create' }).first().click();
	await page.getByRole('textbox', { name: 'name' }).fill('name');
	await page
		.getByRole('textbox', { name: 'description' })
		.fill('description');
	await page.getByRole('button', { name: 'create' }).click();

	await page.waitForLoadState('networkidle');

	expect(await page.getByText('name').count()).toBeGreaterThanOrEqual(1);
	await page.screenshot({ path: 'createsg .png' });
});
