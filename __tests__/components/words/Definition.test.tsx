import { Definition } from '@/components/words/Definition';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import definition from 'mocks/mock-data/definition';

describe('Definition', () => {
	it('renders properly', async () => {
		const { getByText } = render(<Definition definition={definition} />);
		expect(getByText(/definitions/i)).toBeInTheDocument();
		expect(getByText('interjection')).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(getByText('interjection'));
		expect(getByText('a greeting or salutation')).toBeInTheDocument();
	});
});
