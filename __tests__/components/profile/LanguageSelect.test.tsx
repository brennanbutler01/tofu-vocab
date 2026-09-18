import { LanguageSelect } from '@/components/profile/LanguageSelect';
import { render } from '@testing-library/react';

describe('LanguageSelect', () => {
	it('should render a select', () => {
		const { getByRole } = render(
			<LanguageSelect field="learningLanguage" />,
		);
		expect(getByRole('combobox')).toBeInTheDocument();
	});
});
