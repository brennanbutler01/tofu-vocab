import { SideRadio } from '@/components/profile/SideRadio';
import { render } from '@testing-library/react';

describe('SideRadio', () => {
	it('should render radio group', () => {
		const { getByRole } = render(<SideRadio editing={true} />);
		expect(getByRole('radiogroup')).toBeInTheDocument();
	});
});
