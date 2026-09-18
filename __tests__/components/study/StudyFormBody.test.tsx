import { StudyFormBody } from '@/components/study/StudyFormBody';
import { fireEvent, render } from '@testing-library/react';

import { DEFAULT_THEME } from '@mantine/core';

describe('StudyFormBody renders form elements appropriately', () => {
	it('it renders an answer input, two appear here because we cannot simulate the media query', () => {
		const { getAllByRole } = render(<StudyFormBody />);
		expect(getAllByRole('textbox')).toHaveLength(2);
	});

	it('renders a reset button, two appear here because we cannot simulate media query', () => {
		const { getAllByRole } = render(<StudyFormBody />);
		expect(getAllByRole('button', { name: /reset/i })).toHaveLength(2);
	});

	it('renders a submit button, two appear here because we cannot simulate media query', () => {
		const { getAllByRole } = render(<StudyFormBody />);
		expect(getAllByRole('button', { name: /submit/i })).toHaveLength(2);
	});
});
