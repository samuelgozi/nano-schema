module.exports = {
	allowedProps: ['required', 'enum'],

	validateType(value) {
		return typeof value === 'string' && value !== '';
	}
};
