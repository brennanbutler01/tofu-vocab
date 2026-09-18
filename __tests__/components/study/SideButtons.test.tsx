import { SideButtons } from '@/components/study/SideButtons';
import { render } from '@testing-library/react';

describe('SideButtons works as intended', () => {
	it('should render two buttons', () => {
		const setSide = jest.fn();
		const { getAllByRole } = render(
			<SideButtons
				setSide={setSide}
				side="FRONT"
			/>,
		);
		expect(getAllByRole('button')).toHaveLength(2);
	});

	it('should show the active button', () => {
		const setSide = jest.fn();
		const { getByRole } = render(
			<SideButtons
				setSide={setSide}
				side="FRONT"
			/>,
		);
		expect(getByRole('button', { name: 'front' })).toHaveClass(
			'selected-button',
		);
	});
});
