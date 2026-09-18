//this is used to make our tests leaner - we dont have to transform all of the dates manually
export function transformMockedData(data: Record<string, unknown>) {
	// iterate through our keys, vals
	return Object.entries(data).reduce((acc, [k, v]) => {
		//if the val is a Date
		if (v instanceof Date) {
			//make it a string and shallow merge
			return { ...acc, [k]: v.toISOString() };
		}
		//if not a date, just add it in
		return { ...acc, [k]: v };
	}, {});
}
