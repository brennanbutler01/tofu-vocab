import { AppTitle } from '@/components/AppTitle';
import { render } from '@testing-library/react';

describe('AppTitle component should function properly', () => {
	it('should render the passed in text', () => {
		const { getByText } = render(<AppTitle text="test text" />);
		expect(getByText(/test text/i)).toBeInTheDocument();
	});
});
