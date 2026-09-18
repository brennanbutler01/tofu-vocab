import { FormBody } from '@/components/flashcard/FormBody';
import { render } from '@testing-library/react';

describe('FormBody should render as intended', () => {
	it('should have a front input', () => {
		const setIgnoreDuplicates = jest.fn();
		const { getByLabelText } = render(
			<FormBody setIgnoreDuplicates={setIgnoreDuplicates} />,
		);
		expect(getByLabelText(/front/i)).toBeInTheDocument();
	});

	it('should have a back input', () => {
		const setIgnoreDuplicates = jest.fn();
		const { getByLabelText } = render(
			<FormBody setIgnoreDuplicates={setIgnoreDuplicates} />,
		);
		expect(getByLabelText(/back/i)).toBeInTheDocument();
	});

	it('should render a submit button', () => {
		const setIgnoreDuplicates = jest.fn();
		const { getByRole } = render(
			<FormBody setIgnoreDuplicates={setIgnoreDuplicates} />,
		);
		expect(getByRole('button', { name: /create/i })).toBeInTheDocument();
	});

	it('submit button should say update if we are editing', () => {
		const setIgnoreDuplicates = jest.fn();
		const { getByRole } = render(
			<FormBody
				editing
				setIgnoreDuplicates={setIgnoreDuplicates}
			/>,
		);
		expect(getByRole('button', { name: /update/i })).toBeInTheDocument();
	});

	it('should render a cancel button', () => {
		const setIgnoreDuplicates = jest.fn();
		const { getByRole } = render(
			<FormBody setIgnoreDuplicates={setIgnoreDuplicates} />,
		);
		expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
	});

	it('should not render an error if we dont  have duplicates', () => {
		const setIgnoreDuplicates = jest.fn();
		const { queryByRole } = render(
			<FormBody setIgnoreDuplicates={setIgnoreDuplicates} />,
		);
		expect(queryByRole('alert')).not.toBeInTheDocument();
	});

	it('should render an error if we have duplicates', () => {
		const setIgnoreDuplicates = jest.fn();
		const { getByRole } = render(
			<FormBody
				setIgnoreDuplicates={setIgnoreDuplicates}
				hasDuplicates
			/>,
		);
		expect(getByRole('alert')).toBeInTheDocument();
	});
});
