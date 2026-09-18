import { ModalTitle } from '@/components/ModalTitle';
import { render } from '@testing-library/react';

describe('ModalTitle', () => {
	it('should render a title', () => {
		const { getByText } = render(<ModalTitle text="test" />);
		expect(getByText('test')).toBeInTheDocument();
	});
});
