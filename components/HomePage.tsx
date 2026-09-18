import Head from 'next/head';
import { Layout } from './Layout';
import HomeHero from '@/components/HomeCopy';

export default function HomePage() {
	return (
		<div>
			<Head>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<title>Home - tofu.vocab</title>
			</Head>
			<Layout isProtected={false}>
				<HomeHero />
			</Layout>
		</div>
	);
}
