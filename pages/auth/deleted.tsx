import {
	Button,
	Card,
	Container,
	Grid,
	Group,
	Text,
	Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { BiHome } from 'react-icons/bi';
import Head from 'next/head';

export default function DeletedUser() {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Deleted Account - tofu.vocab</title>
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
							Deleted Account!
						</Title>
						<Text
							size="lg"
							color="dimmed"
							p="xl"
							align="center"
						>
							Your account and all of your data has been deleted!
						</Text>{' '}
						<Group position="center">
							<Button
								leftIcon={<BiHome />}
								onClick={async () => await router.push('/')}
							>
								Go back home
							</Button>
						</Group>
					</Card>
				</Container>
			</Grid>
		</>
	);
}
