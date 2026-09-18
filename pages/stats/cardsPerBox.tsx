import { Layout } from '@/components/Layout';
import Head from 'next/head';
import { Box, Text } from '@mantine/core';
import { AppTitle } from '@/components/AppTitle';
import userStatsCrud, { ICountPerBox } from 'user/crud/stats';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { useCardsPerBoxSWR } from 'user/swr';
import CardsPerBoxFunnel from '@/components/stats/CardsPerBoxFunnel';
import CardsPerBoxPie from '@/components/stats/CardsPerBoxPie';
import { useState } from 'react';
import CardsPerBoxChartTypeGroup from '@/components/stats/CardsPerBoxChartTypeGroup';
import { useFlashcardSWR } from 'flashcard/swr';
import SelectedCardsTable from '@/components/stats/SelectedCardsTable';
import { BarDatum } from '@nivo/bar';
import CardBoxBar from '@/components/stats/CardBoxBar';

type Props = { swrCardsPerBox: ICountPerBox[] };

function boxes({ swrCardsPerBox }: Props) {
	const { cardsPerBox } = useCardsPerBoxSWR(swrCardsPerBox);
	const [chart, setChart] = useState<'funnel' | 'pie'>('pie');
	const [selectedBox, setSelectedBox] = useState(-1);
	const { flashcards } = useFlashcardSWR({});
	const [selection, setSelection] = useState<string[]>([]);

	const setBox = (box: number) => setSelectedBox(box);

	return (
		<div>
			<Head>
				<title>Cards/Box - tofu.vocab</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Layout>
				<>
					<AppTitle text="Boxes" />
					<Text
						size="xs"
						color="dimmed"
					>
						These charts will break down your boxes by the number of
						cards in each box.
					</Text>
					{cardsPerBox && (
						<Box h={450}>
							{chart === 'funnel' ? (
								<CardsPerBoxFunnel
									cardsPerBox={cardsPerBox}
									setBox={setBox}
								/>
							) : (
								<CardsPerBoxPie
									cardsPerBox={cardsPerBox}
									setBox={setBox}
								/>
							)}
						</Box>
					)}
					<CardsPerBoxChartTypeGroup
						chart={chart}
						setChart={setChart}
					/>
					{selection?.length > 0 && (
						<Box h={300}>
							<CardBoxBar
								data={flashcards?.reduce<BarDatum[]>(
									(acc, curr) => {
										if (selection?.includes(curr.id)) {
											return [
												...acc,
												{
													card: curr.front.join(','),
													correct:
														curr.attempts.filter(
															a => a.isCorrect,
														)?.length,
													incorrect:
														curr.attempts.filter(
															a => !a.isCorrect,
														)?.length,
												},
											];
										}
										return acc;
									},
									[],
								)}
							/>
						</Box>
					)}
					{selectedBox !== -1 && (
						<Box mt="lg">
							<Text size="lg">Box {selectedBox} Flashcards</Text>
							<SelectedCardsTable
								selection={selection}
								setSelection={setSelection}
								data={flashcards?.filter(
									c => c.box.boxNumber === selectedBox,
								)}
							/>
						</Box>
					)}
				</>
			</Layout>
		</div>
	);
}

export default boxes;

export async function getServerSideProps({
	req,
	res,
}: GetServerSidePropsContext) {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	} else {
		return {
			props: {
				swrCardsPerBox: await userStatsCrud.getCardsPerBox(
					session?.user?.id,
				),
			},
		};
	}
}
