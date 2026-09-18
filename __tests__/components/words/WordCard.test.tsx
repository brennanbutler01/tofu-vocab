import { WordCard } from '@/components/words/WordCard';
import { render } from '@testing-library/react';

describe('WordCard', () => {
	it('should render a title', () => {
		const { getByRole } = render(<WordCard />);
		expect(getByRole('heading', { name: /new word/i })).toBeInTheDocument();
	});

	it('should render a button to let us fetch a word', () => {
		const { getByRole } = render(<WordCard />);
		expect(
			getByRole('button', { name: /fetch new word/i }),
		).toBeInTheDocument();
	});
});
