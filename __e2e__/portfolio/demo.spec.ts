import { test, expect } from '@playwright/test';

test('creates, searches, edits, flips and deletes a flashcard', async ({
	page,
}) => {
	const errors: string[] = [];
	const apiRequests: string[] = [];
	page.on('pageerror', error => errors.push(error.message));
	page.on('request', request => {
		if (new URL(request.url()).pathname.startsWith('/api/'))
			apiRequests.push(request.url());
	});
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'Your vocabulary, growing.' }),
	).toBeVisible();
	await expect(page.getByRole('article')).toHaveCount(12);
	await page.getByRole('button', { name: 'Add flashcard' }).click();
	await page.getByLabel('English', { exact: true }).fill('good morning');
	await page.getByLabel('Vietnamese', { exact: true }).fill('chào buổi sáng');
	await page.getByRole('button', { name: 'Save flashcard' }).click();
	await expect(page.getByRole('article')).toHaveCount(13);
	await page.getByLabel('Search flashcards').fill('good morning');
	await expect(page.getByRole('article')).toHaveCount(1);
	await page
		.getByRole('button', { name: 'Flip good morning', exact: true })
		.click();
	await expect(
		page.getByText('chào buổi sáng', { exact: true }),
	).toBeVisible();
	await page
		.getByRole('button', { name: 'Edit good morning', exact: true })
		.click();
	await page.getByLabel('English', { exact: true }).fill('morning greeting');
	await page.getByRole('button', { name: 'Save flashcard' }).click();
	await expect(
		page.getByRole('button', {
			name: 'Edit morning greeting',
			exact: true,
		}),
	).toBeVisible();
	page.once('dialog', dialog => dialog.accept());
	await page
		.getByRole('button', { name: 'Delete morning greeting', exact: true })
		.click();
	await expect(page.getByRole('article')).toHaveCount(12);
	expect(errors).toEqual([]);
	expect(apiRequests).toEqual([]);
});

test('grades answers, moves review boxes and tracks real session progress', async ({
	page,
}) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Start a review' }).click();
	await expect(
		page.getByRole('heading', { name: 'hello', exact: true }),
	).toBeVisible();
	await page.getByLabel('Your answer', { exact: true }).fill('xin chào');
	await page.getByRole('button', { name: 'Check answer' }).click();
	await expect(page.getByText('You’ve got it!')).toBeVisible();
	await expect(page.getByText('Moved to box 2.')).toBeVisible();
	await page.getByRole('button', { name: 'Next word' }).click();
	await page.getByRole('button', { name: 'I don’t know yet' }).click();
	await expect(
		page.getByText('Back to box 1 for another review.'),
	).toBeVisible();
	await page.getByRole('button', { name: 'Progress', exact: true }).click();
	await expect(
		page.getByRole('heading', { name: '50%', exact: true }),
	).toBeVisible();
	await expect(page.getByText('1 correct out of 2 reviews')).toBeVisible();
	await expect(
		page.getByRole('meter', { name: 'Cards in box 2', exact: true }),
	).toHaveAttribute('value', '1');
});

test('keeps demo changes private to each tab and resets on reload', async ({
	page,
	context,
}) => {
	await page.goto('/');
	page.once('dialog', dialog => dialog.accept());
	await page
		.getByRole('button', { name: 'Delete hello', exact: true })
		.click();
	await expect(page.getByRole('article')).toHaveCount(11);
	const other = await context.newPage();
	await other.goto('/');
	await expect(other.getByRole('article')).toHaveCount(12);
	await other.close();
	await page.reload();
	await expect(page.getByRole('article')).toHaveCount(12);
	page.once('dialog', dialog => dialog.accept());
	await page
		.getByRole('button', { name: 'Delete hello', exact: true })
		.click();
	page.once('dialog', dialog => dialog.accept());
	await page.getByRole('button', { name: 'Reset demo' }).click();
	await expect(page.getByRole('article')).toHaveCount(12);
});

test('works at phone width and exposes no private server endpoints', async ({
	page,
	request,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'Your vocabulary, growing.' }),
	).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth,
		),
	).toBe(true);
	await page.getByRole('button', { name: 'Study', exact: true }).click();
	await expect(page.getByLabel('Your answer', { exact: true })).toBeVisible();
	await page.screenshot({
		path: 'test-results/portfolio-mobile.png',
		fullPage: true,
	});
	for (const path of [
		'/api/auth/session',
		'/api/user/portfolio-demo',
		'/.env',
		'/.env.local',
	]) {
		expect((await request.get(path)).status()).toBe(404);
	}
	await page.setViewportSize({ width: 1440, height: 1050 });
	await page.getByRole('button', { name: 'Flashcards', exact: true }).click();
	await page.screenshot({
		path: 'test-results/portfolio-desktop.png',
		fullPage: true,
	});
});
