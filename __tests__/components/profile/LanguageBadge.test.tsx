import { LanguageBadge } from '@/components/profile/LanguageBadge';
import { render } from '@testing-library/react';

describe('LanguageBadge', () => {
	it('should render vietnamese values', () => {
		const { getByRole, getByText } = render(
			<LanguageBadge language="VIETNAMESE" />,
		);
		expect(getByText('Vietnamese')).toBeInTheDocument();
		expect(getByRole('img')).toHaveAttribute('title', 'Vietnamese Flag');
	});

	it('should render english values', () => {
		const { getByRole, getByText } = render(
			<LanguageBadge language="ENGLISH" />,
		);
		expect(getByText('English')).toBeInTheDocument();
		expect(getByRole('img')).toHaveAttribute('title', 'US Flag');
	});
});
