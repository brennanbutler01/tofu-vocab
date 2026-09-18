import { Group, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { User } from '@prisma/client';
import { LanguageBadge } from './LanguageBadge';
import { LanguageSelect } from './LanguageSelect';
import { UserFormProps } from './UserForm';

type StudyFields = 'studying' | 'native';

type Props = {
	editing: boolean;
	field: StudyFields;
	user: User;
	form?: UseFormReturnType<UserFormProps>;
};

export const config: Record<
	StudyFields,
	{ label: string; dataKey: 'learningLanguage' | 'nativeLanguage' }
> = {
	studying: {
		label: 'Studying:',
		dataKey: 'learningLanguage',
	},
	native: {
		label: 'Native:',
		dataKey: 'nativeLanguage',
	},
};

export default function ManageLanguage({ editing, field, user, form }: Props) {
	return (
		<Group position="apart">
			<Text size="sm">{config[field].label} </Text>
			{editing ? (
				<LanguageSelect
					form={form}
					field={config[field].dataKey}
				/>
			) : (
				<LanguageBadge language={user[config[field].dataKey]} />
			)}
		</Group>
	);
}
