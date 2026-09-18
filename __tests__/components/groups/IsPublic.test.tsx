import IsPublic from '@/components/groups/IsPublic';
import { render } from '@testing-library/react';

describe('IsPublic', () => {
	it('should show if it is public', () => {
		const { getByTestId, getByText } = render(
			<IsPublic visibility={'public'} />,
		);
		expect(getByTestId('public icon')).toBeInTheDocument();
		expect(getByText('Public')).toBeInTheDocument();
	});

	it('should show if it is private', () => {
		const { getByTestId, getByText } = render(
			<IsPublic visibility="private" />,
		);

		expect(getByTestId('private icon')).toBeInTheDocument();
		expect(getByText('Private')).toBeInTheDocument();
	});
});
