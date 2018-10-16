module.exports = {
	validateType(value) {
		return typeof value === 'string';
	},

	validateSchema(schemaObject) {
		const allowedProps = ['type', 'required', 'enum'];

		for (let prop in schemaObject) {
			// Check if the property is allowed.
			if (!allowedProps.includes(prop)) {
				throw Error(`Unknown property "${prop}"`);
			}

			// Verify that 'required' is a Boolean.
			if (prop === 'required') {
				if (typeof schemaObject.required !== 'boolean') {
					throw Error('Property named "required" should be of type boolean');
				}
			}

			// Verify that enum is an Array.
			if (prop === 'enum') {
				if (!Array.isArray(schemaObject.enum)) {
					throw Error('Property named "enum" should be of type Array');
				}
			}
		}
	},

	required(value) {
		return value !== '' && value !== undefined;
	},

	enum(value, options) {
		return options.includes(value);
	}
};
