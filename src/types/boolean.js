module.exports = {
	allowedProps: ['required'],

	validateType(value) {
		return typeof value === 'boolean';
	}
};
