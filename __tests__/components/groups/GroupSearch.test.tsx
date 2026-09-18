import GroupSearch from '@/components/groups/GroupSearch';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('GroupSearch', () => {
	it('should show a search', () => {
		const { getByRole } = render(
			<GroupSearch
				search={''}
				setSearch={jest.fn()}
			/>,
		);

		expect(getByRole('searchbox')).toBeInTheDocument();
	});

	it('should start the search with whatever value we pass', () => {
		const { getByRole } = render(
			<GroupSearch
				search={'searching'}
				setSearch={jest.fn()}
			/>,
		);

		expect(getByRole('searchbox')).toHaveValue('searching');
	});

	it('should call setSearch on typing', async () => {
		const setSearch = jest.fn();
		const { getByRole } = render(
			<GroupSearch
				search=""
				setSearch={setSearch}
			/>,
		);
		const user = userEvent.setup();
		await user.type(getByRole('searchbox'), 'test');
		expect(setSearch).toHaveBeenLastCalledWith('t');
	});
});
