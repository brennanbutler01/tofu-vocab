import { test, expect } from '@playwright/test';
import prisma from '../../prisma/db/index';

test.beforeAll(async () => {
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
			back: ['moi'],
			front: ['new'],
		},
	});
});

test('can study card', async ({ page }) => {
	await page.goto('/study');
	await page.waitForLoadState('load');
	await page.screenshot({ path: 'before.png' });
	await expect(
		page.getByText(/what word matches the definition below?/i),
	).toBeVisible();
	await page.getByRole('textbox', { name: 'Answer' }).fill('moi');
	await page.getByRole('button', { name: 'Submit' }).click();
	expect(await page.getByRole('alert').count()).toBe(2);
	await page.getByRole('button', { name: 'Advance' }).click();
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('textbox', { name: 'Answer' })).toBeVisible();
	await page.screenshot({ path: 'study-one-ss-.png' });
});
