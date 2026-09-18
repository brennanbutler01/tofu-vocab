import { render } from '@testing-library/react';
import { PronunciationItem } from '@/components/words/PronunciationItem';
import { Menu } from '@mantine/core';

describe('PronunciationItem', () => {
	it('should render the passed in source', () => {
		const src = 'https://lex-audio.useremarkable.com/mp3/hello_us_1.mp3';
		const { getByText, getByTestId } = render(
			<Menu>
				<PronunciationItem
					source={src}
					playingOne={false}
					setPlayingOne={() => {}}
				/>
			</Menu>,
		);
		expect(
			getByText('https://lex-audio.useremarkable.com/mp3/hello...'),
		).toBeInTheDocument();
		expect(getByTestId('playPronunciation')).toBeInTheDocument();
	});
});
