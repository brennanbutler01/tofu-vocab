import { Menu } from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react';
import PlayPronunciation from './PlayPronunciation';

type Props = {
	source: string;
	playingOne: boolean;
	setPlayingOne: React.Dispatch<React.SetStateAction<boolean>>;
};

export function PronunciationItem({
	source,
	playingOne,
	setPlayingOne,
}: Props) {
	const [playing, setPlaying] = useState(false);

	const cancelPlaying = () => {
		setPlaying(false);
		setPlayingOne(false);
	};
	const startPlaying = () => {
		setPlaying(true);
		setPlayingOne(true);
	};

	useEffect(() => {
		audio.addEventListener('playing', startPlaying);
		audio.addEventListener('pause', cancelPlaying);
		audio.addEventListener('ended', cancelPlaying);

		return () => {
			audio.removeEventListener('playing', startPlaying);
			audio.removeEventListener('pause', cancelPlaying);
			audio.removeEventListener('ended', cancelPlaying);
		};
	});
	const audio = useMemo(() => new Audio(source), []);
	return (
		<Menu.Item
			icon={
				<PlayPronunciation
					playingOne={playingOne}
					playing={playing}
				/>
			}
			key={source}
			onClick={async () => await (playing ? audio.pause() : audio.play())}
			disabled={playingOne && !playing}
		>
			{source.length > 25 ? `${source.substring(0, 45)}...` : source}
		</Menu.Item>
	);
}
