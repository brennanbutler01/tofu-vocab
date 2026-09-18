import { BoxTransition } from '@/components/study/BoxTransition';
import { render } from '@testing-library/react';

describe('BoxTransition works properly', () => {
	it('renders the from box with text From Box #', () => {
		const { getByText } = render(
			<BoxTransition
				newBox={1}
				oldBox={0}
			/>,
		);
		expect(getByText(/from/i)).toBeInTheDocument();
		expect(getByText(1)).toBeInTheDocument();
	});

	it('renders the to box with text to Box #', () => {
		const { getByText } = render(
			<BoxTransition
				newBox={1}
				oldBox={0}
			/>,
		);
		expect(getByText(/to/i)).toBeInTheDocument();
		expect(getByText(2)).toBeInTheDocument();
	});
});
