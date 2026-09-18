import CurrentStreak from '@/components/stats/CurrentStreak';
import { render } from '@testing-library/react';
import { mockUsers } from 'mocks/mock-data/user';

describe('BestStreak component', () => {
	it('Should render a sad face if we have a negative streak', () => {
		const { getByTestId } = render(
			<CurrentStreak user={{ ...mockUsers[0], currentStreak: -10 }} />,
		);
		expect(getByTestId('sad')).toBeInTheDocument();
	});

	it('Should render a fire if we have a positive streak', () => {
		const { getByTestId } = render(
			<CurrentStreak user={{ ...mockUsers[0], currentStreak: 10 }} />,
		);
		expect(getByTestId('fire')).toBeInTheDocument();
	});

	it('Should render the current streak we pass in', () => {
		const { getByText } = render(
			<CurrentStreak user={{ ...mockUsers[0], currentStreak: 12 }} />,
		);
		expect(getByText(`12 correct`)).toBeInTheDocument();
	});
});
