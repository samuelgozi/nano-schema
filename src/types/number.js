module.exports = {
	allowedProps: ['type', 'required', 'enum'],

	validateType(value) {
		return typeof value === 'number' && !Number.isNaN(value);
	}
};
