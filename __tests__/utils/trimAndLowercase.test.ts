import { trimAndLowercase } from 'utils/trimAndLowercase';

describe('Trim and Lowercase fn should work', () => {
	it('should return a lowercase string', () => {
		const res = trimAndLowercase('A');
		expect(res).toBe('a');
	});

	it('should trim any white space', () => {
		const res = trimAndLowercase(' A ');
		expect(res).toBe('a');
	});
});
