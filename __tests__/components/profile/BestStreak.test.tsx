import BestStreak from '@/components/stats/BestStreak';
import { render } from '@testing-library/react';
import { mockUsers } from 'mocks/mock-data/user';

describe('BestStreak component', () => {
	it('Should render an icon', () => {
		const { getByTestId } = render(<BestStreak user={mockUsers[0]} />);
		expect(getByTestId('bolt')).toBeInTheDocument();
	});

	it('Should render the best streak we pass in', () => {
		const { getByText } = render(
			<BestStreak user={{ ...mockUsers[0], bestStreak: 12 }} />,
		);
		expect(getByText(`12 correct`)).toBeInTheDocument();
	});
});
