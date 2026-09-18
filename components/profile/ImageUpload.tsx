import { FileInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React, { SetStateAction } from 'react';
import { BiUpload } from 'react-icons/bi';
import { uploadImage } from 'utils/uploadImage';
import { UserFormProps } from './UserForm';

type Props = {
	setLoading: React.Dispatch<SetStateAction<boolean>>;
	form?: UseFormReturnType<UserFormProps>;
};

export function ImageUpload({ setLoading, form }: Props) {
	return (
		<FileInput
			name="profile image"
			label="Upload image"
			icon={<BiUpload size={24} />}
			size="lg"
			m="sm"
			radius="md"
			onChange={async file => {
				setLoading(true);
				if (file) {
					const url = await uploadImage(file);
					form?.setFieldValue('image', url.message);
				}
				setLoading(false);
			}}
		/>
	);
}
