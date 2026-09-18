import ManageLanguage, { config } from '@/components/profile/ManageLanguage';
import { useForm } from '@mantine/form';
import { render } from '@testing-library/react';
import { mockUsers } from 'mocks/mock-data/user';

describe('ManageLanguage', () => {
	it('should render a select if we are editing', () => {
		const { getByRole } = render(
			<ManageLanguage
				editing={true}
				field="studying"
				user={mockUsers[0]}
			/>,
		);
		expect(getByRole('combobox')).toBeInTheDocument();
	});

	it('should not render a select if we are not editing', () => {
		const { queryByRole } = render(
			<ManageLanguage
				editing={false}
				field="studying"
				user={mockUsers[0]}
			/>,
		);
		expect(queryByRole('combobox')).not.toBeInTheDocument();
	});

	it('should render text of native language - English', () => {
		const { getByText } = render(
			<ManageLanguage
				editing={false}
				field="native"
				user={mockUsers[0]}
			/>,
		);

		expect(getByText(config['native'].label)).toBeInTheDocument();
		expect(getByText('English')).toBeInTheDocument();
	});

	it('should render text of studying language - Vietnamese', () => {
		const { getByText } = render(
			<ManageLanguage
				editing={false}
				field="studying"
				user={mockUsers[0]}
			/>,
		);

		expect(getByText(config['studying'].label)).toBeInTheDocument();
		expect(getByText('Vietnamese')).toBeInTheDocument();
	});
});
