import { test, expect } from '@playwright/test';

for (const mobile of [false, true])
	test(`visitor flashcards, persistence, study and reset (${mobile ? 'mobile' : 'desktop'})`, async ({
		page,
		context,
		baseURL,
		browser,
	}) => {
		if (mobile) await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/auth/signin');
		await page
			.getByRole('button', { name: 'Start demo', exact: true })
			.click();
		await expect(page).toHaveURL(/flashcards/);
		const headers = { Origin: baseURL! };
		const session = await (
			await context.request.get('/api/demo/session')
		).json();
		try {
			const cards = await (
				await context.request.get('/api/flashcards/ALL')
			).json();
			for (const card of cards)
				expect(
					(
						await context.request.delete(
							'/api/flashcard/' + card.id,
							{ headers },
						)
					).status(),
				).toBe(200);
			await page.reload();
			await page
				.getByRole('button', { name: /create/i })
				.first()
				.click();
			await page
				.getByRole('textbox', { name: /front/i })
				.fill('browser hello');
			await page.getByRole('textbox', { name: /back/i }).fill('xin chào');
			await page.getByRole('button', { name: /^create$/i }).click();
			await expect(
				page.getByText('browser hello', { exact: true }).first(),
			).toBeVisible();
			await page.reload();
			await expect(
				page.getByText('browser hello', { exact: true }).first(),
			).toBeVisible();
			const savedCards = await (
				await context.request.get('/api/flashcards/ALL')
			).json();
			const cardId = savedCards[0].id;
			const other = await browser.newContext({ baseURL });
			try {
				expect(
					(
						await other.request.post('/api/demo/session', {
							headers,
						})
					).status(),
				).toBe(200);
				for (const method of ['GET', 'PUT', 'DELETE'])
					expect(
						(
							await other.request.fetch(
								'/api/flashcard/' + cardId,
								{
									method,
									headers,
									...(method === 'PUT'
										? {
												data: {
													front: ['stolen'],
													back: ['wrong'],
												},
											}
										: {}),
								},
							)
						).status(),
					).toBe(404);
			} finally {
				await other.request.delete('/api/demo/session', { headers });
				await other.close();
			}
			expect(
				(
					await context.request.post('/api/flashcards/ALL', {
						headers: { Origin: 'https://untrusted.example' },
						data: { front: ['bad'], back: ['bad'] },
					})
				).status(),
			).toBe(403);
			await page.goto('/study');
			await page
				.getByRole('textbox', { name: /^answer/i })
				.fill('xin chào');
			const saved = page.waitForResponse(
				r =>
					r.url().includes('/api/flashcard/') &&
					r.request().method() === 'PUT',
			);
			await page.getByRole('button', { name: /^submit$/i }).click();
			expect((await saved).status()).toBe(200);
			await expect(
				page.getByRole('button', { name: /^advance$/i }),
			).toBeVisible();
			const card = await (
				await context.request.get('/api/flashcard/' + cardId)
			).json();
			expect(card.attempts).toHaveLength(1);
			expect(card.box.boxNumber).toBe(1);
			expect(
				(
					await context.request.post('/api/upload', { headers })
				).status(),
			).toBe(503);
			expect((await context.request.get('/api/words')).status()).toBe(
				503,
			);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
			const oldCookies = await context.cookies();
			await page
				.getByRole('button', { name: 'Reset demo', exact: true })
				.click();
			await expect(page).toHaveURL(/auth\/signin/);
			await context.addCookies(oldCookies);
			expect(
				(await context.request.get('/api/demo/session')).status(),
			).toBe(401);
			expect(
				(
					await context.request.get('/api/user/' + session.userId)
				).status(),
			).toBe(401);
		} finally {
			await context.request.delete('/api/demo/session', { headers });
		}
	});
