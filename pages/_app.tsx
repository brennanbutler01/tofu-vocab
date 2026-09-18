import { AppProps } from 'next/app';
import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { Bitter, Mansalva, Raleway } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { RouterTransition } from '@/components/RouterTransition';
import { useState } from 'react';

// If loading a variable font, you don't need to specify the font weight
export const mansalva = Mansalva({
	subsets: ['vietnamese'],
	weight: ['400'],
});

export const raleway = Raleway({
	weight: ['400', '700', '300', '900', '200', '500', '600'],
	subsets: ['vietnamese', 'latin'],
});

export const bitter = Bitter({
	weight: 'variable',
	subsets: ['vietnamese', 'latin'],
});

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
	require('../mocks');
}

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: colorScheme,
					primaryColor: 'teal',
					defaultGradient: {
						from: 'green.3',
						to: 'green.8',
						deg: 10,
					},
					fontFamily: bitter.style.fontFamily,
					headings: { fontFamily: raleway.style.fontFamily },
					globalStyles: theme => ({
						body: {
							width: '100vw',
							height: '100vh',
							...theme.fn.fontStyles(),
							backgroundColor:
								theme.colorScheme === 'dark'
									? theme.colors.dark[7]
									: theme.fn.lighten(
											theme.colors.gray[0],
											0.05,
									  ),
						},
					}),
				}}
			>
				<RouterTransition />
				<ModalsProvider>
					<Notifications />
					<SessionProvider session={session}>
						<Component {...pageProps} />
					</SessionProvider>
				</ModalsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
