module.exports = {
	allowedProps: ['type', 'required', 'enum'],

	validateType(value) {
		return typeof value === 'string';
	},

	required(value) {
		return this.validateType(value) && value !== '';
	}
};
