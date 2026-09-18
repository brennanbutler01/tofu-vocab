import { ProfileImage } from '@/components/profile/ProfileImage';
import { render } from '@testing-library/react';

describe('ProfileImage works as intended', () => {
	it('renders an image', () => {
		const { getByRole } = render(<ProfileImage editing={false} />);
		expect(getByRole('img')).toBeInTheDocument();
	});

	it('renders a button when editing', () => {
		const { getByRole } = render(<ProfileImage editing={true} />);
		expect(getByRole('button')).toBeInTheDocument();
	});

	it('does not render a button when not editing', () => {
		const { queryByRole } = render(<ProfileImage editing={false} />);
		expect(queryByRole('button')).not.toBeInTheDocument();
	});
});
