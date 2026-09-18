import { useState } from 'react';
import {
	Button,
	Card,
	Container,
	Grid,
	Group,
	Text,
	Title,
} from '@mantine/core';
type Provider = { id: string; name: string };
import { getProviders, signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';
import Head from 'next/head';

//TODO - type this better. we are only using google right now but we will just keep it
export default function SignIn({ providers }: { providers: Provider[] }) {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	if (process.env.NEXT_PUBLIC_VISITOR_DEMO === 'true')
		return (
			<Container
				size="sm"
				py="xl"
			>
				<Title>Try Tofu.Vocab</Title>
				<Text my="md">
					Create flashcards, practice Vietnamese and track your
					progress. No signup needed. Your demo is private, expires
					after one hour and uses only invented data.
				</Text>
				<Button
					loading={loading}
					onClick={async () => {
						setLoading(true);
						setError('');
						try {
							const response = await fetch('/api/demo/session', {
								method: 'POST',
							});
							if (!response.ok)
								throw new Error(
									'The demo could not start. Please try again shortly.',
								);
							window.location.assign('/flashcards');
						} catch (error) {
							setError(
								error instanceof Error
									? error.message
									: 'The demo could not start.',
							);
						} finally {
							setLoading(false);
						}
					}}
				>
					Start demo
				</Button>
				{error && (
					<Text
						role="alert"
						color="red"
					>
						{error}
					</Text>
				)}
			</Container>
		);
	return (
		<>
			<Head>
				<title>Sign in - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Grid
				h={'100vh'}
				w={'100vw'}
				align="center"
			>
				<Container>
					<Card
						withBorder
						radius="md"
						shadow={'md'}
						sx={{ maxWidth: '380px' }}
						p="lg"
					>
						<Title
							fw={300}
							align="center"
						>
							Sign In!
						</Title>
						<Text
							size="lg"
							color="dimmed"
							p="xl"
							align="center"
						>
							Sign in to have your learning experience
							personalized for your own studies. Please create an
							account and improve your Vietnamese today!
						</Text>{' '}
						<Group position="center">
							{Object.values(providers).map(provider => (
								<div key={provider.name}>
									<Button
										leftIcon={<FaGoogle />}
										variant="light"
										onClick={() =>
											signIn(provider.id, {
												callbackUrl: '/',
											})
										}
									>
										Sign in with {provider.name}
									</Button>
								</div>
							))}
						</Group>
					</Card>
				</Container>
			</Grid>
		</>
	);
}

export async function getServerSideProps() {
	const providers =
		process.env.VISITOR_DEMO === 'true' ? {} : await getProviders();
	return {
		props: { providers },
	};
}
