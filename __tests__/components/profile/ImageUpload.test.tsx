import { ImageUpload } from '@/components/profile/ImageUpload';
import { render } from '@testing-library/react';

describe('ImageUpload works as intended', () => {
	it('has an input', () => {
		const { getByRole } = render(<ImageUpload setLoading={jest.fn()} />);
		expect(getByRole('button')).toBeInTheDocument();
	});
});
