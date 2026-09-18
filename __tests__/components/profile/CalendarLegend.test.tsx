import CalendarLegend from '@/components/stats/CalendarLegend';
import { render } from '@testing-library/react';

test('CalendarLegend should render children', () => {
	const { getByRole, getAllByRole } = render(<CalendarLegend />);
	expect(getByRole('list')).toBeInTheDocument();
	expect(getAllByRole('listitem')).toHaveLength(3);
});
