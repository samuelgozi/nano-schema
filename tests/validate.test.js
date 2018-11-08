const Schema = require('../src/index');

describe('Validator(the method)', () => {
	test('Throws when unspecified props exist on the object', () => {
		const schema = new Schema({});

		function validate() {
			const obj = {
				name: 'Slim...',
				unwanted: true
			};

			const schemaObj = {
				name: {
					type: String
				}
			};

			try {
				schema.validate(obj, schemaObj);
			} catch (e) {
				return e;
			}
		}

		expect(validate()).toEqual(new Map([['unwanted', 'Unknown property']]));
	});

	test('Throws when a nested object has an error with correct path to prop', () => {
		const schema = new Schema({});

		function validate() {
			const obj = {
				name: {
					first: 'Slim',
					last: 42
				}
			};

			const schemaObj = {
				name: {
					type: Object,
					child: {
						first: {
							type: String
						},
						last: {
							type: String
						}
					}
				}
			};

			try {
				schema.validate(obj, schemaObj);
			} catch (e) {
				return e;
			}
		}

		expect(validate()).toEqual(
			new Map([['name.last', 'The field is not of the correct type']])
		);
	});

	test('Throws with correct path when unallowed properties are present', () => {
		const schema = new Schema({});

		function validate() {
			const obj = { name: 'Forty two' };

			const schemaObj = {
				life: {
					type: Number
				}
			};

			try {
				schema.validate(obj, schemaObj, 'parentPropName');
			} catch (e) {
				return e;
			}
		}

		expect(validate()).toEqual(
			new Map([['parentPropName.name', 'Unknown property']])
		);
	});

	test('Throws when an object is required but empty', () => {
		function validate() {
			const schema = new Schema({
				address: {
					type: Object,
					required: true,
					child: {
						street: {
							type: String
						}
					}
				}
			});

			schema.validate({ address: {} });
		}

		expect(validate).toThrow(
			'The object "address" is required, but left empty'
		);
	});

	// test('Multiple Errors are merged correctly', () => {
	// 	function validate() {
	// 		const schema = new Schema({
	// 			name: String,
	// 			address: {
	// 				type: Object,
	// 				required: true,
	// 				child: {
	// 					street: String
	// 				}
	// 			}
	// 		});

	// 		const obj = {
	// 			name: 42,
	// 			address: {
	// 				street: []
	// 			}
	// 		};

	// 		try {
	// 			schema.validate(obj);
	// 		} catch (e) {
	// 			if (e.propPath === undefined) throw e;
	// 			return e;
	// 		}
	// 	}

	// 	const expected = new Map([
	// 		['name', 'incorrect type'],
	// 		['address.street', 'incorrect type']
	// 	]);

	// 	expect(validate()).toEqual(expected);
	// });
});
