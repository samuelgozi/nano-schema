module.exports = {
	allowedProps: ['type', 'required'],

	validateType(value) {
		return typeof value === 'boolean';
	}
};
