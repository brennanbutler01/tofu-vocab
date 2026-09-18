import { Button, ButtonProps } from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import { SessionProvider, useSession } from 'next-auth/react';
import { ModalTitle } from '../ModalTitle';
import { FlashcardForm, FormValues } from './FlashcardForm';
import useSWRMutation from 'swr/mutation';
import flashcardCreate from 'flashcard/crud/create';
import { FlashcardSources, Prisma, FlashcardOrigins } from '@prisma/client';
import { useBoxesSWR } from 'boxes/swr';
import { useFlashcardSWR } from 'flashcard/swr';
import React from 'react';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

interface IProps extends ButtonProps {
	source: FlashcardSources;
	wordToPopulate?: { word: string; translation?: string };
	origin?: FlashcardOrigins;
}

export const CreateFlashcardButton = ({
	source,
	wordToPopulate,
	origin,
	...rest
}: IProps) => {
	const boxes = useBoxesSWR();
	const { flashcards } = useFlashcardSWR({});

	const { trigger, isMutating } = useSWRMutation<
		FlashcardWithBox[],
		Error,
		string,
		Prisma.FlashcardCreateInput
	>(
		'/api/flashcards/' + source,
		async (url: string, { arg }: { arg: Prisma.FlashcardCreateInput }) =>
			await flashcardCreate
				.apiCreateFlashcard(arg, source)
				.then(res => [...flashcards, res]),
	);
	const session = useSession();

	const handleClick = () =>
		openModal({
			children: (
				<SessionProvider>
					<FlashcardForm
						wordToPopulate={wordToPopulate}
						onReset={() => closeAllModals()}
						onSubmit={async (vals: FormValues['card']) => {
							if (!session.data?.user)
								throw new Error(
									'Please sign in before saving a flashcard.',
								);
							await flashcardCreate.parseCreate({
								origin: origin || FlashcardOrigins.USER,
								formVals: vals,
								user: session.data.user,
								trigger,
								userBoxes: boxes.boxes || [],
							});
						}}
					/>
				</SessionProvider>
			),

			title: <ModalTitle text="Create Flashcard" />,
			shadow: 'lg',
			centered: true,
			withCloseButton: false,
		});

	return (
		<div>
			<Button
				onClick={handleClick}
				color="teal"
				radius="md"
				loading={isMutating}
				variant="light"
				{...rest}
			>
				create flashcard
			</Button>
		</div>
	);
};
