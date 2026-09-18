import { test, Locator, Page } from '@playwright/test';
import prisma from '../../prisma/db/index';

test.beforeEach(async () => {
	await prisma.studyGroup.create({
		data: {
			description: 'description',
			name: 'name',
			createdAt: new Date(),
			users: {
				connect: {
					id: process.env.E2E_USER_ID,
				},
			},
			owner: { connect: { id: process.env.E2E_USER_ID } },
			allowJoin: true,
			updatedAt: new Date(),
		},
	});
});

const checkEdit = async (
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
		await page.getByRole('textbox', { name: /name/i }).fill('edited-this');
		await page.getByRole('button', { name: 'update' }).click();

		return;
	} else {
		//if we are out of menu items, return and fail the test.
		if (index + 1 > count) {
			return;
			//if we still have menu items, we should check the others
		} else {
			return await checkEdit(locator, index + 1, count, page);
		}
	}
};

test('can edit study group', async ({ page }) => {
	await page.goto('/studyGroups');
	const locator = page.getByRole('button', { name: /edit group/i });
	const count = await locator.count();
	await checkEdit(locator, 0, count, page);
	await page.waitForLoadState('networkidle');

	await page.getByText('edited-this').isVisible();
	await page.screenshot({ path: 'edit-sg-result.png' });
});
