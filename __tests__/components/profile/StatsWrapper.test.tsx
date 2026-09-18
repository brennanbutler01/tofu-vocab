import { StatsWrapper } from '@/components/stats/StatsWrapper';
import { render } from '@testing-library/react';

test('StatsWrapper should render passed in children', () => {
	const { getByText } = render(
		<StatsWrapper>
			<div>Children</div>
		</StatsWrapper>,
	);
	expect(getByText('Children')).toBeInTheDocument();
});
