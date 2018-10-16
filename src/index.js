class Schema {
	constructor(schema) {
		// Verify that the input is an Object.
		if (Object.prototype.toString.call(schema) !== '[object Object]')
			throw Error('Schema must be an object');

		this.__schema = schema;
	}
}

module.exports = Schema;
