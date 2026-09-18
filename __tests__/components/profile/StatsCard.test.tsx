import { StatsCard } from '@/components/stats/StatsCard';
import { render } from '@testing-library/react';

test('StatsCard should render children', () => {
	const { getByText } = render(
		<StatsCard>
			<div>Children</div>
		</StatsCard>,
	);
	expect(getByText('Children')).toBeInTheDocument();
});
