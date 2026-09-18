import type { FlashcardWithBox } from '../flashcard/crud/getOne';

export type DemoCard = FlashcardWithBox & { category: string };
const words = [
	['hello', 'xin chào', 'Everyday'],
	['thank you', 'cảm ơn', 'Everyday'],
	['goodbye', 'tạm biệt', 'Everyday'],
	['yes', 'vâng', 'Everyday'],
	['water', 'nước', 'Food & drink'],
	['coffee', 'cà phê', 'Food & drink'],
	['bread', 'bánh mì', 'Food & drink'],
	['rice', 'cơm', 'Food & drink'],
	['airport', 'sân bay', 'Travel'],
	['train', 'tàu hỏa', 'Travel'],
	['hotel', 'khách sạn', 'Travel'],
	['market', 'chợ', 'Travel'],
];
export function makeCard({
	id,
	front,
	back,
	category = 'Your words',
}: {
	id: string;
	front: string;
	back: string;
	category?: string;
}): DemoCard {
	const date = new Date('2026-01-01T00:00:00Z');
	return {
		id,
		front: front
			.split(',')
			.map(value => value.trim())
			.filter(Boolean),
		back: back
			.split(',')
			.map(value => value.trim())
			.filter(Boolean),
		category,
		userId: 'portfolio-demo',
		boxId: 'box-0',
		origin: 'USER',
		created_at: date,
		updated_at: date,
		box: {
			id: 'box-0',
			userId: 'portfolio-demo',
			boxNumber: 0,
			created_at: date,
			updated_at: date,
		},
		attempts: [],
	};
}
export function createSampleCards(): DemoCard[] {
	return words.map(([front, back, category], index) =>
		makeCard({ id: 'sample-' + index, front, back, category }),
	);
}
