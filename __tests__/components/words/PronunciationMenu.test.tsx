import PronunciationMenu from '@/components/words/PronunciationMenu';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import definition from 'mocks/mock-data/definition';

describe('PronunciationMenu', () => {
	it('should render a menu with a trigger button', async () => {
		const { getByRole } = render(
			<PronunciationMenu definition={definition} />,
		);
		expect(getByRole('button')).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(getByRole('button'));
		expect(getByRole('menu')).toBeInTheDocument();
		expect(
			getByRole('menuitem', {
				name: 'https://lex-audio.useremarkable.com/mp3/hello...',
			}),
		).toBeInTheDocument();
	});
});
