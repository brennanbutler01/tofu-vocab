import { FlashcardSearch } from '@/components/flashcard/FlashcardSearch';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FlashcardSearch should render', () => {
	it('should have a search element', () => {
		const onChange = jest.fn();
		const { getByRole } = render(
			<FlashcardSearch
				value={''}
				onChange={onChange}
			/>,
		);
		expect(getByRole('search')).toBeInTheDocument();
	});

	it('should have a search input', () => {
		const onChange = jest.fn();
		const { getByRole } = render(
			<FlashcardSearch
				value={''}
				onChange={onChange}
			/>,
		);
		expect(getByRole('searchbox')).toBeInTheDocument();
	});

	it('should allow us to type, calling the onChange', async () => {
		const onChange = jest.fn();
		const user = userEvent.setup();
		const { getByRole } = render(
			<FlashcardSearch
				value=""
				onChange={onChange}
			/>,
		);
		await user.type(getByRole('searchbox'), 'hi');
		expect(onChange).toHaveBeenLastCalledWith('i');
	});
});
