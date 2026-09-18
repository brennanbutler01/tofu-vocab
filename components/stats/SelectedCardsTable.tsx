import React, { useState } from 'react';
import {
	createStyles,
	Group,
	Text,
	Progress,
	Table,
	ScrollArea,
	Checkbox,
} from '@mantine/core';
import { FlashcardWithBox } from 'flashcard/crud/getOne';

const useStyles = createStyles(theme => ({
	header: {
		position: 'sticky',
		top: 0,
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'box-shadow 150ms ease',

		'&::after': {
			content: '""',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			borderBottom: `1px solid ${
				theme.colorScheme === 'dark'
					? theme.colors.dark[3]
					: theme.colors.gray[2]
			}`,
		},
	},
	progressBar: {
		'&:not(:first-of-type)': {
			borderLeft: `3px solid ${
				theme.colorScheme === 'dark'
					? theme.colors.dark[7]
					: theme.white
			}`,
		},
	},
	scrolled: {
		boxShadow: theme.shadows.sm,
	},
	rowSelected: {
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
				: theme.colors[theme.primaryColor][0],
	},
}));

interface TableScrollAreaProps {
	data: FlashcardWithBox[];
	selection: string[];
	setSelection: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SelectedCardsTable({
	data,
	selection,
	setSelection,
}: TableScrollAreaProps) {
	const { classes, cx, theme } = useStyles();
	const [scrolled, setScrolled] = useState(false);

	const toggleRow = (id: string) =>
		setSelection(current =>
			current.includes(id)
				? current.filter(item => item !== id)
				: [...current, id],
		);
	const toggleAll = () =>
		setSelection(current =>
			current.length === data.length ? [] : data.map(item => item.id),
		);

	const rows = data.map(row => {
		const selected = selection.includes(row.id);
		return (
			<tr
				key={row.id}
				className={cx({ [classes.rowSelected]: selected })}
			>
				<td>
					<Checkbox
						checked={selection.includes(row.id)}
						onChange={() => toggleRow(row.id)}
						transitionDuration={0}
					/>
				</td>
				<td>{row.front.join(',')}</td>
				<td>{row.back.join(',')}</td>
				<td>{row.attempts.length}</td>
				<td>
					<Group position="apart">
						<Text
							size="xs"
							color="teal"
							weight={700}
						>
							{(
								(row.attempts.filter(a => a.isCorrect)?.length /
									row.attempts.length) *
								100
							).toFixed(1)}
							%
						</Text>
						<Text
							size="xs"
							color="red"
							weight={700}
						>
							{(
								(row.attempts.filter(a => !a.isCorrect).length /
									row.attempts.length) *
								100
							).toFixed(1)}
							%
						</Text>
					</Group>
					<Progress
						classNames={{ bar: classes.progressBar }}
						sections={[
							{
								value: 51,
								color:
									theme.colorScheme === 'dark'
										? theme.colors.teal[9]
										: theme.colors.teal[6],
							},
							{
								value: 50,
								color:
									theme.colorScheme === 'dark'
										? theme.colors.red[9]
										: theme.colors.red[6],
							},
						]}
					/>
				</td>
			</tr>
		);
	});

	return (
		<ScrollArea
			sx={{ height: 300 }}
			onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
		>
			<Table sx={{ minWidth: 320 }}>
				<thead
					className={cx(classes.header, {
						[classes.scrolled]: scrolled,
					})}
				>
					<tr>
						<th style={{ width: 40 }}>
							<Checkbox
								onChange={toggleAll}
								checked={selection.length === data.length}
								indeterminate={
									selection.length > 0 &&
									selection.length !== data.length
								}
								transitionDuration={0}
							/>
						</th>
						<th>Front</th>
						<th>Back</th>
						<th>Attempts</th>
						<th>Correct</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
		</ScrollArea>
	);
}
