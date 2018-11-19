module.exports = {
	allowedProps: ['required', 'enum', 'test'],

	validateType(value, schema = {}) {
		const typeCheck = typeof value === 'string' && value !== '';

		if (schema.test !== undefined) {
			return typeCheck && schema.test.test(value);
		}

		return typeCheck;
	},

	validateSchema(schema, fieldPath) {
		// If the user specified a regex test.
		if (schema.test !== undefined) {
			if (schema.test.constructor !== RegExp) {
				throw Error(
					`The "test" option in the field "${fieldPath}" should be a RegExp`
				);
			}
		}
	}
};
