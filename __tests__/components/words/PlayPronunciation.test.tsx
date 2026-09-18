import PlayPronunciation from '@/components/words/PlayPronunciation';
import { render } from '@testing-library/react';

describe('PlayPronunciation', () => {
	it('should render an icon', () => {
		const { getByTestId } = render(
			<PlayPronunciation
				playing={false}
				playingOne={false}
			/>,
		);
		expect(getByTestId('playPronunciation')).toBeInTheDocument();
	});
});
