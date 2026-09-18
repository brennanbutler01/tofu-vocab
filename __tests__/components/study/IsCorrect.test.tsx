import { alertConfig, IsCorrect } from '@/components/study/IsCorrect';
import { render } from '@testing-library/react';

describe('IsCorrect should work properly', () => {
	it('should render if we are correct', () => {
		const { getByText } = render(
			<IsCorrect
				oldBox={0}
				newBox={1}
				isCorrect
			/>,
		);
		expect(
			getByText(alertConfig.get(true)?.message as string),
		).toBeInTheDocument();
	});

	it('should render if we are incorrect', () => {
		const { getByText } = render(
			<IsCorrect
				oldBox={0}
				newBox={1}
				isCorrect={false}
			/>,
		);
		expect(
			getByText(alertConfig.get(false)?.message as string),
		).toBeInTheDocument();
	});
});
