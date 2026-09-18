import DisplayWord from '@/components/words/DisplayWord';
import { render } from '@testing-library/react';

describe('DisplayWord', () => {
	it('should render', () => {
		const { getByText } = render(
			<DisplayWord
				translation="xin chao"
				word={'hello'}
				definition={[]}
			/>,
		);

		expect(getByText('xin chao')).toBeInTheDocument();
		expect(getByText('hello')).toBeInTheDocument();
	});
});
