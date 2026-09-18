import { test, expect, Locator, Page } from '@playwright/test';
import prisma from '../../prisma/db/index';

test.beforeEach(async () => {
	await prisma.studyGroup.create({
		data: {
			description: 'test',
			name: 'name',
			allowJoin: true,
			createdAt: new Date(),
			image: null,
			owner: {
				connect: {
					id: process.env.E2E_USER_ID,
				},
			},
			updatedAt: new Date(),
			users: {
				connect: {
					id: process.env.E2E_USER_ID,
				},
			},
		},
	});
});

const checkDelete = async (
	locator: Locator,
	index: number,
	count: number,
	page: Page,
): Promise<undefined> => {
	//check to see if this locator is visible
	if (await locator.nth(index).isVisible()) {
		//if it is, we will click onit
		await locator.nth(index).click();

		//we will delete it
		await page.getByRole('button', { name: /confirm/i }).click();

		//then we should expect our heading - the modal is closed
		await expect(
			page.getByRole('heading', { name: /study groups/i }),
		).toBeVisible();
		return;
	} else {
		//if we are out of menu items, return and fail the test.
		if (index + 1 > count) {
			return;
			//if we still have menu items, we should check the others
		} else {
			return await checkDelete(locator, index + 1, count, page);
		}
	}
};

test('can delete study group', async ({ page }) => {
	await page.goto('/studyGroup');
	const locator = page.getByRole('button', { name: /delete group/i });
	const count = await locator.count();
	await checkDelete(locator, 0, count, page);
	await page.waitForLoadState('networkidle');
	await page.screenshot({ path: 'delete-sg.png' });
});
