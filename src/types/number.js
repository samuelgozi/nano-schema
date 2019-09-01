module.exports = {
	allowedProps: ['required', 'enum', 'coerce'],

	validateType(value, schema = {}) {
		if (schema.coerce === true) value = Number(value);
		return typeof value === 'number' && !Number.isNaN(value);
	}
};
