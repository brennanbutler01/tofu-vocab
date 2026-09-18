import Head from 'next/head';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { checkAnswer } from '../flashcard/checkAnswer';
import { moveToBox } from '../flashcard/moveToBox';
import {
	selectFlashcardForStudy,
	isDueForStudy,
} from '../flashcard/prepareFlashcardForStudy';
import { createSampleCards, makeCard } from './cards';
import type { DemoCard } from './cards';

type View = 'Flashcards' | 'Study' | 'Progress';
type Editor = { id?: string; front: string; back: string };
type Result = { correct: boolean; expected: string; nextBox: number };

export default function Demo() {
	const [cards, setCards] = useState(createSampleCards);
	const [view, setView] = useState<View>('Flashcards');
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('All words');
	const [editor, setEditor] = useState<Editor | null>(null);
	const [flipped, setFlipped] = useState<string[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [answer, setAnswer] = useState('');
	const [result, setResult] = useState<Result | null>(null);
	const [notice, setNotice] = useState('');
	const [formError, setFormError] = useState('');
	const attempts = cards.flatMap(card => card.attempts);
	const correct = attempts.filter(attempt => attempt.isCorrect).length;
	const active = cards.find(card => card.id === activeId);
	const filtered = cards.filter(
		card =>
			(category === 'All words' || card.category === category) &&
			[...card.front, ...card.back].some(word =>
				word
					.toLocaleLowerCase()
					.includes(search.trim().toLocaleLowerCase()),
			),
	);
	const categories = [
		'All words',
		...Array.from(new Set(cards.map(card => card.category))),
	];
	const due = cards.filter(isDueForStudy).length;

	function startStudy() {
		setActiveId(selectFlashcardForStudy(cards, () => 0)?.id || null);
		setAnswer('');
		setResult(null);
		setView('Study');
		setEditor(null);
		setNotice('');
	}
	function saveCard(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editor) return;
		if (
			![editor.front, editor.back].every(value =>
				value.split(',').some(word => word.trim()),
			)
		) {
			setFormError('Add a word or phrase on both sides.');
			return;
		}
		const changed = makeCard({
			id: editor.id || crypto.randomUUID(),
			front: editor.front,
			back: editor.back,
		});
		if (editor.id)
			setCards(
				cards.map(card =>
					card.id === editor.id
						? { ...card, front: changed.front, back: changed.back }
						: card,
				),
			);
		else setCards([...cards, changed]);
		setNotice(editor.id ? 'Flashcard updated.' : 'Flashcard added.');
		setEditor(null);
		setSearch('');
		setCategory('All words');
		setFormError('');
	}
	function grade(isCorrect: boolean) {
		if (!active || result) return;
		const date = new Date();
		const boxNumber = moveToBox(isCorrect, active.box.boxNumber);
		setCards(
			cards.map(card =>
				card.id !== active.id
					? card
					: {
							...card,
							boxId: 'box-' + boxNumber,
							box: {
								...card.box,
								id: 'box-' + boxNumber,
								boxNumber,
							},
							attempts: [
								...card.attempts,
								{
									id: crypto.randomUUID(),
									userId: 'portfolio-demo',
									flashcardId: card.id,
									created_at: date,
									updated_at: date,
									isCorrect,
								},
							],
					  },
			),
		);
		setResult({
			correct: isCorrect,
			expected: active.back.join(' / '),
			nextBox: boxNumber + 1,
		});
	}
	function reset() {
		if (
			!window.confirm(
				'Reset your demo? This removes your changes and restores the sample cards.',
			)
		)
			return;
		setCards(createSampleCards());
		setEditor(null);
		setFlipped([]);
		setSearch('');
		setCategory('All words');
		setActiveId(null);
		setResult(null);
		setView('Flashcards');
		setNotice('Sample cards restored.');
	}
	return (
		<>
			<Head>
				<title>Tofu.Vocab | Vietnamese flashcards</title>
				<meta
					name="description"
					content="Try Brennan Butler’s Vietnamese vocabulary app. Build flashcards, practice Vietnamese, and track your progress in a no-signup portfolio demo."
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
			</Head>
			<header className="header">
				<a
					href="/"
					className="brand"
				>
					<span
						className="brand-icon"
						aria-hidden="true"
					>
						豆
					</span>
					tofu.vocab
					<span className="brand-tag">a little every day</span>
				</a>
				<a
					className="credit"
					href="https://github.com/brennanbutler01"
					target="_blank"
					rel="noreferrer"
				>
					Built by Brennan Butler ↗
				</a>
			</header>
			<div className="demo-bar">
				<span>
					<strong>Portfolio demo</strong> · No signup. Sample data
					stays in this tab and resets on reload.
				</span>
				<button
					className="text-button"
					onClick={reset}
				>
					Reset demo ↺
				</button>
			</div>
			<div className="app-layout">
				<aside className="sidebar">
					<p className="eyebrow">YOUR LEARNING SPACE</p>
					<nav aria-label="Main navigation">
						{(
							['Flashcards', 'Study', 'Progress'] satisfies View[]
						).map((item, index) => (
							<button
								key={item}
								className={
									'nav-item ' +
									(view === item ? 'selected' : '')
								}
								aria-current={
									view === item ? 'page' : undefined
								}
								onClick={() => {
									if (item === 'Study') startStudy();
									else {
										setView(item);
										setEditor(null);
									}
								}}
							>
								<span aria-hidden="true">
									{['▤', '◇', '▥'][index]}
								</span>
								{item}
							</button>
						))}
					</nav>
					<div className="sidebar-note">
						<span
							className="sprout"
							aria-hidden="true"
						>
							✳
						</span>
						<strong>Small steps. More words.</strong>
						<p>
							Practice a little, then come back. Words get easier
							with each review.
						</p>
					</div>
					<p className="language-pair">
						ENGLISH <span>⇄</span> TIẾNG VIỆT
					</p>
				</aside>
				<main>
					<div className="page-title">
						<div>
							<p className="eyebrow">
								{view === 'Flashcards'
									? 'MAKE ROOM FOR NEW WORDS'
									: view === 'Study'
									? 'ONE WORD AT A TIME'
									: 'EVERY REVIEW COUNTS'}
							</p>
							<h1>
								{view === 'Flashcards'
									? 'Your vocabulary, growing.'
									: view === 'Study'
									? 'A little practice goes a long way.'
									: 'See your progress.'}
							</h1>
							<p className="subtitle">
								{view === 'Flashcards'
									? 'Collect the words you want to remember. We’ll help you practice them.'
									: view === 'Study'
									? 'Translate the English prompt into Vietnamese. Accents count.'
									: 'Your activity in this demo session, updated as you study.'}
							</p>
						</div>
						{view === 'Flashcards' && (
							<button
								className="primary"
								onClick={() => {
									setEditor({ front: '', back: '' });
									setFormError('');
								}}
							>
								＋ Add flashcard
							</button>
						)}
					</div>
					<div className="summary">
						<div>
							<strong>{cards.length}</strong>
							<span>words in your collection</span>
						</div>
						<div>
							<strong>{due}</strong>
							<span>ready to review</span>
						</div>
						<div>
							<strong>{attempts.length}</strong>
							<span>reviews this session</span>
						</div>
					</div>
					<p
						className="notice"
						role="status"
					>
						{notice}
					</p>
					{view === 'Flashcards' && (
						<>
							{editor && (
								<section
									className="editor panel"
									aria-label={
										editor.id
											? 'Edit flashcard'
											: 'Add flashcard'
									}
								>
									<h2>
										{editor.id
											? 'Edit your flashcard'
											: 'Make a new connection'}
									</h2>
									<form onSubmit={saveCard}>
										<div className="form-fields">
											<label>
												English
												<input
													autoFocus
													required
													maxLength={500}
													value={editor.front}
													onChange={event =>
														setEditor({
															...editor,
															front: event.target
																.value,
														})
													}
													placeholder="e.g. good morning"
												/>
											</label>
											<label>
												Vietnamese
												<input
													required
													maxLength={500}
													value={editor.back}
													onChange={event =>
														setEditor({
															...editor,
															back: event.target
																.value,
														})
													}
													placeholder="e.g. chào buổi sáng"
												/>
											</label>
										</div>
										<p className="muted">
											Separate alternative answers with
											commas.
										</p>
										{formError && (
											<p role="alert">{formError}</p>
										)}
										<div className="actions">
											<button
												type="button"
												className="secondary"
												onClick={() => setEditor(null)}
											>
												Cancel
											</button>
											<button
												className="primary"
												type="submit"
											>
												Save flashcard
											</button>
										</div>
									</form>
								</section>
							)}
							<div className="collection-tools">
								<div
									className="filters"
									aria-label="Word categories"
								>
									{categories.map(value => (
										<button
											key={value}
											className={
												value === category
													? 'filter active'
													: 'filter'
											}
											aria-pressed={value === category}
											onClick={() => setCategory(value)}
										>
											{value}
										</button>
									))}
								</div>
								<input
									className="search"
									aria-label="Search flashcards"
									placeholder="Search your words…"
									value={search}
									onChange={event =>
										setSearch(event.target.value)
									}
								/>
							</div>
							<div className="card-grid">
								{filtered.map(card => (
									<article
										className="word-card"
										key={card.id}
									>
										<div className="card-meta">
											<span>{card.category}</span>
											<span>
												Box {card.box.boxNumber + 1}
											</span>
										</div>
										<button
											className="card-face"
											aria-label={
												'Flip ' + card.front.join(', ')
											}
											onClick={() =>
												setFlipped(
													flipped.includes(card.id)
														? flipped.filter(
																id =>
																	id !==
																	card.id,
														  )
														: [...flipped, card.id],
												)
											}
										>
											<span className="word-language">
												{flipped.includes(card.id)
													? 'TIẾNG VIỆT'
													: 'ENGLISH'}
											</span>
											<strong
												lang={
													flipped.includes(card.id)
														? 'vi'
														: 'en'
												}
											>
												{(flipped.includes(card.id)
													? card.back
													: card.front
												).join(' / ')}
											</strong>
											<span className="flip-hint">
												Tap to flip ↻
											</span>
										</button>
										<div className="card-footer">
											<span className="status-dot">
												{card.attempts.length
													? 'Practiced'
													: 'New word'}
											</span>
											<div>
												<button
													className="text-button"
													aria-label={
														'Edit ' + card.front[0]
													}
													onClick={() => {
														setEditor({
															id: card.id,
															front: card.front.join(
																', ',
															),
															back: card.back.join(
																', ',
															),
														});
														setFormError('');
														window.scrollTo({
															top: 0,
															behavior: 'smooth',
														});
													}}
												>
													Edit
												</button>
												<button
													className="text-button delete"
													aria-label={
														'Delete ' +
														card.front[0]
													}
													onClick={() => {
														if (
															window.confirm(
																'Delete this flashcard?',
															)
														) {
															setCards(
																cards.filter(
																	value =>
																		value.id !==
																		card.id,
																),
															);
															setNotice(
																'Flashcard deleted.',
															);
														}
													}}
												>
													Delete
												</button>
											</div>
										</div>
									</article>
								))}
							</div>
							{!filtered.length && (
								<div className="empty panel">
									<h2>No words here yet.</h2>
									<p>
										{cards.length
											? 'Try another search or category.'
											: 'Add your first flashcard, or reset the demo to explore the sample collection.'}
									</p>
								</div>
							)}
							<div className="study-callout">
								<div>
									<h2>Let’s make these words stick.</h2>
									<p>
										A quick review now makes the next
										conversation easier.
									</p>
								</div>
								<button
									className="primary"
									onClick={startStudy}
								>
									Start a review →
								</button>
							</div>
						</>
					)}
					{view === 'Study' && (
						<section className="study panel">
							{active ? (
								<>
									<p className="eyebrow">
										TRANSLATE INTO VIETNAMESE · BOX{' '}
										{active.box.boxNumber + 1}
									</p>
									<h2 className="study-word">
										{active.front.join(' / ')}
									</h2>
									{!result ? (
										<form
											onSubmit={event => {
												event.preventDefault();
												if (answer.trim())
													grade(
														checkAnswer(
															active,
															answer.split(','),
															'FRONT',
														),
													);
											}}
										>
											<label>
												Your answer
												<input
													autoFocus
													required
													value={answer}
													onChange={event =>
														setAnswer(
															event.target.value,
														)
													}
													placeholder="Type the Vietnamese word…"
													autoComplete="off"
												/>
											</label>
											<div className="actions">
												<button
													className="secondary"
													type="button"
													onClick={() => grade(false)}
												>
													I don’t know yet
												</button>
												<button
													className="primary"
													type="submit"
												>
													Check answer
												</button>
											</div>
										</form>
									) : (
										<div
											className={
												'answer-result ' +
												(result.correct
													? 'correct'
													: 'incorrect')
											}
											role="status"
										>
											<h3>
												{result.correct
													? 'You’ve got it!'
													: 'A word to practice again.'}
											</h3>
											<p>
												The answer is{' '}
												<strong lang="vi">
													{result.expected}
												</strong>
												.
											</p>
											<p>
												{result.correct
													? 'Moved to box ' +
													  result.nextBox +
													  '.'
													: 'Back to box 1 for another review.'}
											</p>
											<button
												className="primary"
												onClick={startStudy}
											>
												Next word →
											</button>
										</div>
									)}
									<p className="study-explanation">
										Correct answers move a card forward.
										Missed answers return it to the first
										box. Cards that need review come first.
									</p>
								</>
							) : (
								<div className="empty">
									<h2>Your collection is empty.</h2>
									<p>Add a flashcard to start practicing.</p>
									<button
										className="primary"
										onClick={() => setView('Flashcards')}
									>
										Go to flashcards
									</button>
								</div>
							)}
						</section>
					)}
					{view === 'Progress' && (
						<>
							<div className="progress-grid">
								<section className="panel">
									<p className="eyebrow">
										ACCURACY THIS SESSION
									</p>
									<h2 className="big-number">
										{attempts.length
											? Math.round(
													(correct /
														attempts.length) *
														100,
											  ) + '%'
											: '—'}
									</h2>
									<p>
										{correct} correct out of{' '}
										{attempts.length} reviews
									</p>
								</section>
								<section className="panel">
									<p className="eyebrow">YOUR REVIEW BOXES</p>
									<h2>From new to familiar</h2>
									<p className="muted">
										Each correct answer moves a card one box
										forward.
									</p>
									{[0, 1, 2, 3, 4].map(box => {
										const count = cards.filter(
											card => card.box.boxNumber === box,
										).length;
										return (
											<div
												className="box-row"
												key={box}
											>
												<span>Box {box + 1}</span>
												<meter
													aria-label={
														'Cards in box ' +
														(box + 1)
													}
													min={0}
													max={Math.max(
														cards.length,
														1,
													)}
													value={count}
												/>
												<strong>{count}</strong>
											</div>
										);
									})}
								</section>
							</div>
							<div className="study-callout">
								<div>
									<h2>Progress starts with a word.</h2>
									<p>
										Try a few reviews and watch your
										collection move.
									</p>
								</div>
								<button
									className="primary"
									onClick={startStudy}
								>
									Keep practicing →
								</button>
							</div>
						</>
					)}
					<footer>
						Made for curious learners.{' '}
						<span>Sample collection · English / Vietnamese</span>
					</footer>
				</main>
			</div>
		</>
	);
}
