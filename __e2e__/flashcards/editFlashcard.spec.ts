import { closeButtonLabel } from '@/components/flashcard/DuplicateAlert';
import { test, Locator, Page } from '@playwright/test';
import prisma from '../../prisma/db/index';

test.beforeEach(async () => {
	await prisma.flashcard.create({
		data: {
			createdBy: {
				connect: {
					id: process.env.E2E_USER_ID,
				},
			},
			box: {
				connect: {
					userId_boxNumber: {
						boxNumber: 0,
						userId: process.env.E2E_USER_ID as string,
					},
				},
			},
			back: ['backs'],
			front: ['edit-this'],
		},
	});
});

const checkMenu = async (
	locator: Locator,
	index: number,
	count: number,
	page: Page,
): Promise<undefined> => {
	//check to see if this locator is visible
	if (await locator.nth(index).isVisible()) {
		//if it is, we will click onit
		await locator.nth(index).click();
		//we will edit it
		await page.getByRole('menuitem', { name: /edit/i }).click();
		await page.getByRole('textbox', { name: /front/i }).fill('edited-this');
		await page.getByRole('button', { name: 'update' }).click();

		const closeButton = page.getByRole('button', {
			name: closeButtonLabel,
		});

		//if we have an alert for duplicates
		if (await closeButton.isVisible()) {
			//we will close it to ignore
			await closeButton.click();
			await page.getByRole('button', { name: /update/i }).click();
		}
		return;
	} else {
		//if we are out of menu items, return and fail the test.
		if (index + 1 > count) {
			return;
			//if we still have menu items, we should check the others
		} else {
			return await checkMenu(locator, index + 1, count, page);
		}
	}
};

test('can edit flashcard', async ({ page }) => {
	await page.goto('/flashcards');
	const locator = page.getByRole('button', { name: 'flashcard-menu-button' });
	const count = await locator.count();
	await checkMenu(locator, 0, count, page);
	await page.waitForLoadState('networkidle');

	await page.screenshot({ path: 'edit-result.png' });
	await page.getByText('edited-this').isVisible();
});
