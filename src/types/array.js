module.exports = {
	allowedProps: ['required', 'child'],

	validateType(value) {
		return Array.isArray(value);
	}
};
