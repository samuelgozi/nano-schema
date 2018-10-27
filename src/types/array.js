module.exports = {
	allowedProps: ['type', 'required', 'child'],

	validateType(value) {
		return Array.isArray(value);
	}
};
