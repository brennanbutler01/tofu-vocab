import {
	Button,
	Divider,
	Group,
	Input,
	LoadingOverlay,
	Paper,
	Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { ProfileImage } from './ProfileImage';
import { FormBody } from './FormBody';
import { Languages, StudySides, User } from '@prisma/client';
import { showNotification } from '@mantine/notifications';
import { BiCheck, BiX } from 'react-icons/bi';
import ManageLanguage from './ManageLanguage';
import { SideRadio } from './SideRadio';
import { AppTitle } from '../AppTitle';
import { MdSettings } from 'react-icons/md';

export type UserFormProps = {
	name: string | null;
	email: string | null;
	image: string | null;
	nativeLanguage: Languages;
	learningLanguage: Languages;
	studySide: StudySides;
};

type Props = {
	editing: boolean;
	cancelEditing: () => void;
	startEditing: () => void;
	user: User;
	onSubmit: (vals: UserFormProps) => Promise<void>;
};

export default function UserForm({
	editing,
	cancelEditing,
	onSubmit,
	user,
	startEditing,
}: Props) {
	const [loading, setLoading] = useState(false);

	const form = useForm<UserFormProps>({
		initialValues: {
			name: user.name || null,
			email: user.email || null,
			image: user.image || null,
			nativeLanguage: user.nativeLanguage || Languages.ENGLISH,
			learningLanguage: user.learningLanguage || Languages.VIETNAMESE,
			studySide: user.studySide || StudySides.FRONT,
		},
	});

	return (
		<form
			aria-label="user form"
			onSubmit={form.onSubmit(async vals => {
				setLoading(true);
				try {
					await onSubmit(vals);
					showNotification({
						color: 'teal',
						icon: <BiCheck size={32} />,
						message: 'Profile updated!',
					});
				} catch {
					showNotification({
						color: 'red',
						message:
							'Could not save your profile. Please try again.',
					});
				} finally {
					setLoading(false);
				}
			})}
			onReset={() => {
				showNotification({
					color: 'red',
					icon: <BiX size={32} />,
					message: 'Profile update cancelled.',
				});
				form.reset();
				cancelEditing();
			}}
		>
			<Stack>
				<Stack
					spacing="xl"
					p="xl"
				>
					<Group
						align={'center'}
						position="apart"
					>
						<AppTitle text="Your profile" />
						<Group
							position={editing ? 'center' : 'apart'}
							w={'100%'}
							noWrap
						>
							{editing ? null : (
								<Button
									onClick={startEditing}
									leftIcon={<MdSettings />}
									variant="light"
									color={'teal'}
								>
									Edit
								</Button>
							)}
							{form.values.image ? (
								<ProfileImage
									editing={editing}
									form={form}
								/>
							) : editing ? (
								<ImageUpload
									form={form}
									setLoading={setLoading}
								/>
							) : null}
						</Group>
					</Group>
					<Paper
						radius="md"
						p="md"
					>
						<Stack spacing="lg">
							<Stack
								spacing="xs"
								mt={'sm'}
							>
								<Input.Label>
									Your Preferred Language
								</Input.Label>
								<ManageLanguage
									editing={editing}
									field="native"
									user={user}
									form={form}
								/>
								<ManageLanguage
									editing={editing}
									field="studying"
									user={user}
									form={form}
								/>
							</Stack>
							<SideRadio
								editing={editing}
								form={form}
							/>
						</Stack>
					</Paper>
				</Stack>
				<Divider />
				<FormBody
					form={form}
					editing={editing}
					cancelEditing={cancelEditing}
				/>
			</Stack>
			<LoadingOverlay
				visible={loading}
				h={'100%'}
			/>
		</form>
	);
}
