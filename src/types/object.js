module.exports = {
	validateType(value) {
		return Object.prototype.toString.call(value) === '[object Object]';
	},

	validateSchema(schemaObject) {
		const allowedProps = ['type', 'required'];

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
