import { StatsTitle } from '@/components/stats/StatsTitle';
import { render } from '@testing-library/react';

test('StatsTitle should render children', () => {
	const { getByText } = render(
		<StatsTitle>
			<div>Children</div>
		</StatsTitle>,
	);
	expect(getByText('Children')).toBeInTheDocument();
});
