import TranslationGrid from '@/components/words/TranslationGrid';
import { render } from '@testing-library/react';

describe('TranslationGrid', () => {
	it('should render english and vietnamese', () => {
		const { getByText } = render(
			<TranslationGrid
				translation="xin chao"
				word="hello"
			/>,
		);

		expect(getByText('English')).toBeInTheDocument();
		expect(getByText('Vietnamese')).toBeInTheDocument();
	});

	it('should render the word and translation', () => {
		const { getByText } = render(
			<TranslationGrid
				translation="xin chao"
				word="hello"
			/>,
		);
		expect(getByText('hello')).toBeInTheDocument();
		expect(getByText('xin chao')).toBeInTheDocument();
	});
});
