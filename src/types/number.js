module.exports = {
	validateType(value) {
		return typeof value === 'number' && !Number.isNaN(value);
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

			if (prop === 'enum') {
				// Verify that enum is an Array.
				if (!Array.isArray(schemaObject.enum)) {
					throw Error('Property named "enum" should be of type Array');
				}

				// Verify that all the options inside the the enum are of the correct type.
				for (let option of schemaObject.enum) {
					if (!this.validateType(option)) {
						throw Error(
							'All the options inside the enum should be of the correct type'
						);
					}
				}
			}
		}
	},

	enum(value, options) {
		return options.includes(value);
	}
};
