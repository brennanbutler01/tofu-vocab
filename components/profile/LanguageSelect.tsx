import { Group, Select, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Languages } from '@prisma/client';
import { forwardRef } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { trimAndLowercase } from 'utils/trimAndLowercase';
import { UserFormProps } from './UserForm';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
	icon: React.ReactNode;
	label: React.ReactNode;
	value: Languages;
}

const data = [
	{
		label: 'Vietnamese',
		value: Languages.VIETNAMESE,
		icon: (
			<ReactCountryFlag
				countryCode="VN"
				title="Vietnamese Flag"
			/>
		),
	},
	{
		label: 'English',
		value: Languages.ENGLISH,
		icon: (
			<ReactCountryFlag
				countryCode="US"
				title="US Flag"
			/>
		),
	},
];

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
	({ icon, label, value, ...others }: ItemProps, ref) => (
		<div
			ref={ref}
			{...others}
		>
			<Group noWrap>
				{icon}
				<Text size="sm">{label}</Text>
			</Group>
		</div>
	),
);

type Props = {
	form?: UseFormReturnType<UserFormProps>;
	field: 'nativeLanguage' | 'learningLanguage';
};

export function LanguageSelect({ form, field }: Props) {
	return (
		<Select
			radius="md"
			label="Select Language"
			labelProps={{ hidden: true }}
			placeholder="Vietnamese"
			itemComponent={SelectItem}
			searchable
			filter={(search, item) =>
				trimAndLowercase(item?.label || '').includes(
					trimAndLowercase(search),
				)
			}
			icon={data.find(item => item.value === form?.values[field])?.icon}
			data={data}
			{...form?.getInputProps(field)}
		/>
	);
}
