import { ThemeIcon } from '@mantine/core';
import React from 'react';
import { BiLoader, BiPause, BiPlay } from 'react-icons/bi';

type Props = {
	playingOne: boolean;
	playing: boolean;
};

export default function PlayPronunciation({ playingOne, playing }: Props) {
	return (
		<ThemeIcon
			variant="light"
			radius="md"
			data-testId="playPronunciation"
		>
			{playing ? <BiPause /> : playingOne ? <BiLoader /> : <BiPlay />}
		</ThemeIcon>
	);
}
