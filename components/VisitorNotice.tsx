import { Alert, Button, Group, Text } from '@mantine/core';
import { useState } from 'react';

export function VisitorNotice() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	if (process.env.NEXT_PUBLIC_VISITOR_DEMO !== 'true') return null;
	return (
		<Alert
			title="Portfolio demo"
			color="teal"
			m="sm"
		>
			<Group position="apart">
				<Text size="sm">
					Invented data only. Your private demo lasts one hour and
					saves changes across reloads. Uploads, automatic translation
					and invitations are unavailable.
				</Text>
				<Button
					loading={loading}
					onClick={async () => {
						setLoading(true);
						setError('');
						try {
							const response = await fetch('/api/demo/session', {
								method: 'DELETE',
							});
							if (!response.ok)
								throw new Error(
									'Could not reset your demo. Please try again.',
								);
							window.location.assign('/auth/signin');
						} catch (error) {
							setError(
								error instanceof Error
									? error.message
									: 'Could not reset your demo.',
							);
						} finally {
							setLoading(false);
						}
					}}
				>
					Reset demo
				</Button>
			</Group>
			{error && (
				<Text
					color="red"
					role="alert"
				>
					{error}
				</Text>
			)}
		</Alert>
	);
}
