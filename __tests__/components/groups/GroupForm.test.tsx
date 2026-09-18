import { GroupForm } from '@/components/groups/GroupForm';
import { render } from '@testing-library/react';

describe('GroupForm', () => {
	it('should render a form', () => {
		const { getByRole } = render(<GroupForm onSubmit={async () => {}} />);
		expect(getByRole('form')).toBeInTheDocument();
	});

	it('should have a create and cancel button', () => {
		const { getByRole } = render(<GroupForm onSubmit={async () => {}} />);
		expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /create/i })).toBeInTheDocument();
	});

	it('should have an input for each of our fields', () => {
		const { getByLabelText } = render(
			<GroupForm onSubmit={async () => {}} />,
		);
		expect(getByLabelText(/name/i)).toBeInTheDocument();
		expect(getByLabelText(/description/i)).toBeInTheDocument();
		expect(getByLabelText(/is public/i)).toBeInTheDocument();
	});
});
