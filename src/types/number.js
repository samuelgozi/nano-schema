module.exports = {
	allowedProps: ['required', 'enum'],

	validateType(value) {
		return typeof value === 'number' && !Number.isNaN(value);
	}
};
