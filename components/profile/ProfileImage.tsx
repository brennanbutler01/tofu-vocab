import { Button, Image, Stack, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { BiError } from 'react-icons/bi';
import { UserFormProps } from './UserForm';

type Props = {
	form?: UseFormReturnType<UserFormProps>;
	editing: boolean;
};

export function ProfileImage({ form, editing }: Props) {
	const showImageNotification = () =>
		showNotification({
			message: 'Profile Image unavailable',
			color: 'red',
			icon: <BiError />,
		});

	return (
		<Stack
			align={'center'}
			p="xl"
		>
			<Image
				src={form?.values.image}
				onError={showImageNotification}
				radius={360}
				maw={180}
				alt="Profile Image"
				withPlaceholder
				placeholder={<Text>Error fetching image</Text>}
			/>{' '}
			{editing && (
				<Button
					mt="lg"
					variant="subtle"
					color="red"
					onClick={() => form?.setFieldValue('image', '')}
				>
					Reset Image
				</Button>
			)}
		</Stack>
	);
}
