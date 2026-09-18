import { StatsValue } from '@/components/stats/StatsValue';
import { render } from '@testing-library/react';

test('StatsValue should render children', () => {
	const { getByText } = render(
		<StatsValue>
			<div>Children</div>
		</StatsValue>,
	);
	expect(getByText('Children')).toBeInTheDocument();
});
