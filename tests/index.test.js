const Schema = require('../src/index');

describe('Creating a schema', () => {
	test('Instantiating a `new Schema` with an argument that is not an object', () => {
		function createNewSchema() {
			new Schema(() => {});
		}

		expect(createNewSchema).toThrow('Schema must be an object');
	});

	test('Correct verbose syntax', () => {
		const schemaObject = {
			gender: {
				type: String,
				required: true,
				enum: ['male', 'female']
			},
			age: {
				type: Number,
				required: true
			},
			married: {
				type: Boolean
			},
			birthdate: {
				type: Date
			},
			address: {
				type: Object,
				required: false,
				child: {
					city: {
						type: String,
						required: true
					},
					street: {
						type: String,
						required: true
					}
				}
			},
			favoriteMovies: {
				type: Array
			}
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Correct short syntax with primitive types', () => {
		const schemaObject = {
			name: String,
			age: Number,
			married: Boolean,
			birthdate: Date
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Correct verbose array schema syntax', () => {
		const schemaObject = {
			arrayOfStuff: {
				type: Array,
				child: [
					{
						type: String
					},
					{
						type: Number
					}
				]
			}
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Correct short array syntax', () => {
		const schemaObject = {
			arrayOfStuff: [String, Number]
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Correct short object syntax', () => {
		const schemaObject = {
			personalInfoWeStole: {
				address: String,
				phone: Number
			}
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Multiple Errors are merged correctly', () => {
		function validate() {
			const schema = new Schema({
				name: String,
				address: {
					type: Object,
					required: true,
					child: {
						street: String
					}
				}
			});

			const obj = {
				name: 42,
				address: {
					street: []
				}
			};

			try {
				schema.validate(obj);
			} catch (e) {
				if (!(e instanceof Map)) throw e;
				return e;
			}
		}

		const expected = new Map([
			['name', 'The field is not of the correct type'],
			['address.street', 'The field is not of the correct type']
		]);

		expect(validate()).toEqual(expected);
	});
});

describe('Custom validators', () => {
	test('Added validator is recognised', () => {
		Schema.validators.set('Custom Type', {
			allowedProps: ['type'],
			validateType(value) {
				return (
					typeof value === 'string' &&
					value === 'This is the only accepted value for this "custom type"'
				);
			},

			validateSchema(schemaObject) {
				const allowedProps = ['type'];

				for (let prop in schemaObject) {
					// Check if the property is allowed.
					if (!allowedProps.includes(prop)) {
						throw Error(`Unknown property "${prop}"`);
					}
				}
			}
		});

		const schema = new Schema({
			myField: {
				type: 'Custom Type'
			}
		});

		function validateWithCustomType() {
			schema.validate({
				myField: 'This is the only accepted value for this "custom type"'
			});
		}

		expect(validateWithCustomType).not.toThrow();
	});
});
