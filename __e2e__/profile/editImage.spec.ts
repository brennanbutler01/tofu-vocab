import { test, expect } from '@playwright/test';
test.use({ headless: false });
test('we should be able to reset the image, and upload a new one', async ({
	page,
}) => {
	await page.goto('/profile');
	await expect(
		page.getByRole('img', { name: 'Profile Image' }),
	).toBeVisible();
	await page.getByRole('button', { name: 'Edit' }).click();
	await page.getByRole('button', { name: 'Reset Image' }).click();

	// Start waiting for file chooser before clicking. Note no await.
	const fileChooserPromise = page.waitForEvent('filechooser');
	await page.getByRole('button', { name: 'Upload image' }).click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles('__e2e__/profile/empty.png');

	//we should have an image uploaded
	await expect(
		page.getByRole('img', { name: 'Profile Image' }),
	).toBeVisible();

	//we should be able to reset the image
	await page.getByRole('button', { name: 'Reset Image' }).click();

	//we should be able to upload a new image
	await expect(
		page.getByRole('button', { name: 'Upload image' }),
	).toBeVisible();
});
