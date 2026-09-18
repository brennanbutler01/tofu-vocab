import { AppTitle } from '@/components/AppTitle';
import { Layout } from '@/components/Layout';
import { WordCard } from '@/components/words/WordCard';
import { Container, Text } from '@mantine/core';
import Head from 'next/head';

function WordsPage() {
	return (
		<div>
			<Head>
				<title>Discover - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout isProtected={false}>
				<AppTitle text={'Discover new words'} />
				<Text
					size="sm"
					color="dimmed"
				>
					Find new words to study in English and Vietnamese
				</Text>
				<Container
					p="lg"
					maw={600}
				>
					<WordCard />
				</Container>
			</Layout>
		</div>
	);
}
export default WordsPage;
