import { Loading } from '@/components/Loading';
import { render } from '@testing-library/react';

describe('Loading component should render and function properly', () => {
	it('should show a loader', () => {
		const { getByRole } = render(<Loading />);
		expect(
			getByRole('presentation', { name: /loading spinner/i }),
		).toBeInTheDocument();
	});
});
