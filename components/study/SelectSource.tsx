import { Stack, Radio, Group, Button } from '@mantine/core';
import { getHotkeyHandler, useHotkeys } from '@mantine/hooks';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { FlashcardSources, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import useSWRMutation from 'swr/mutation';
import updateUser from 'user/crud/update';

type Props = { user: User; onSubmit: () => void };

export default function SelectSource({ user, onSubmit }: Props) {
	const [value, setValue] = useState(user?.flashcardSource);
	const { trigger } = useSWRMutation(
		'/api/user/' + user?.id,
		async (url: string, { arg }: { arg: FlashcardSources }) => {
			return await updateUser.apiUpdateUser(user.id, {
				flashcardSource: arg,
			});
		},
	);

	console.log('onSubmit', onSubmit);

	const handleConfirm = () => {
		closeAllModals();
		onSubmit();
		try {
			trigger(value, {
				optimisticData: current =>
					({
						...current,
						flashcardSource: value as FlashcardSources,
					}) as User,
			});
		} catch (err) {
			console.log(err);
		}
		showNotification({
			message: 'Updated study source',
			color: 'teal',
			icon: <BiCheck />,
		});
	};

	return (
		<Stack onKeyDown={getHotkeyHandler([['Enter', handleConfirm]])}>
			<Radio.Group
				name="studySource"
				label="Select flashcard study source"
				withAsterisk
				// size="xs"
				value={value}
				onChange={val => setValue(val as FlashcardSources)}
			>
				<Radio
					label="All"
					value={'ALL'}
				/>
				<Radio
					label="In Progress"
					value={'IN_PROGRESS'}
				/>
				<Radio
					label="Completed"
					value={'BOX4'}
				/>
				<Radio
					label="Not Started"
					value={'NOT_STUDIED'}
				/>
			</Radio.Group>
			<Group position="right">
				<Button
					radius="md"
					variant="default"
					size="sm"
					onClick={() => closeAllModals()}
				>
					cancel
				</Button>
				<Button
					radius="md"
					variant="light"
					size="sm"
					onClick={handleConfirm}
				>
					confirm
				</Button>
			</Group>
		</Stack>
	);
}
