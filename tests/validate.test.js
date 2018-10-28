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

			schema.validate(obj, schemaObj);
		}

		expect(validate).toThrow(
			'The object contains invalid properties: unwanted'
		);
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

			schema.validate(obj, schemaObj);
		}

		expect(validate).toThrow(
			'The field "name.last" is not of the correct type'
		);
	});

	test('Throws whith correct path when unallowed properties are present', () => {
		const schema = new Schema({});

		function validate() {
			const obj = { name: 'Forty two' };

			const schemaObj = {
				life: {
					type: Number
				}
			};

			schema.validate(obj, schemaObj, 'parentPropName');
		}

		expect(validate).toThrow(
			'The object contains invalid properties: parentPropName.name'
		);
	});
});
