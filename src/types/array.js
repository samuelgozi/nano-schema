module.exports = {
	validateType(value) {
		return Array.isArray(value);
	},

	validateSchema(schemaObject) {
		const allowedProps = ['type', 'required', 'child'];

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
		}
	}
};
