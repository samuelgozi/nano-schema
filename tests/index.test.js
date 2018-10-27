const Schema = require('../src/index');

describe('Creating a schema with correct syntax', () => {
	test('Verbose schema syntax', () => {
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

	test('Short schema syntax with primitive types', () => {
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

	test('Verbose array schema syntax', () => {
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

	test('Short array schema syntax', () => {
		const schemaObject = {
			arrayOfStuff: [String, Number]
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Short object schema syntax', () => {
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
});

describe('Creating a schema with incorrect syntax', () => {
	test('Instantiating a `new Schema` with an argument that is not an object', () => {
		function createNewSchema() {
			new Schema(() => {});
		}

		expect(createNewSchema).toThrow('Schema must be an object');
	});

	test('Creating a schema with invalid field options', () => {
		function createNewSchema() {
			new Schema({
				username: {
					type: String,
					name: 'Samuel'
				}
			});
		}

		expect(createNewSchema).toThrow('Unknown property "name"');
	});

	test('Creating a schema with a field that has an invalid type', () => {
		const schemaObject = {
			imVeryCool: false
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).toThrow('Invalid type for the field "imVeryCool"');
	});

	test('Short array schema syntax', () => {
		const schemaObject = {
			arrayOfStuff: ["This shoulden't work!"]
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).toThrow(
			'Invalid type for the field "arrayOfStuff[0]"'
		);
	});

	test('Short object schema syntax', () => {
		const schemaObject = {
			personalInfoWeStole: {
				address: "This shoulden't work!",
				phone: Number
			}
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).toThrow(
			'Invalid type for the field "personalInfoWeStole.address"'
		);
	});
});

describe('Validating objects that match the schema', () => {
	test('Schema with only a type', () => {
		function createNewSchema() {
			const schema = new Schema({
				username: {
					type: String
				},
				age: {
					type: Number
				}
			});

			schema.validate({
				username: 'samuel',
				age: 24
			});
		}

		expect(createNewSchema).not.toThrow();
	});

	test("Correct values with 'enum'", () => {
		function createNewSchema() {
			const schema = new Schema({
				gender: {
					type: String,
					enum: ['male', 'female']
				},
				favoriteNumber: {
					type: Number,
					enum: [42, 84]
				}
			});

			schema.validate({
				gender: 'male',
				favoriteNumber: 42
			});
		}

		expect(createNewSchema).not.toThrow();
	});

	test('Correct values in verbose array schema', () => {
		const arraySchema = new Schema({
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
		});

		function validateArrayWithString() {
			arraySchema.validate({
				arrayOfStuff: ['Hi there!']
			});
		}

		function validateArrayWithNumber() {
			arraySchema.validate({
				arrayOfStuff: [42]
			});
		}

		function validateArrayWithBoth() {
			arraySchema.validate({
				arrayOfStuff: ['Hi there!', 42]
			});
		}

		expect(validateArrayWithString).not.toThrow();
		expect(validateArrayWithNumber).not.toThrow();
		expect(validateArrayWithBoth).not.toThrow();
	});

	test('Short object schema syntax', () => {
		const schema = new Schema({
			personalInfoWeStole: {
				address: String,
				phone: Number
			}
		});

		function validateObject() {
			schema.validate({
				personalInfoWeStole: {
					address: 'that place over there',
					phone: 12323425
				}
			});
		}

		expect(validateObject).not.toThrow();
	});

	test('Short array schema syntax', () => {
		const schema = new Schema({
			favoriteStuff: [String]
		});

		function validateObject() {
			schema.validate({
				favoriteStuff: ['me', 'myself', 'i']
			});
		}

		expect(validateObject).not.toThrow();
	});
});

describe("Validating an object that doesn't match a schema", () => {
	test('Object contains properties not specified in the schema', () => {
		function createNewSchema() {
			const schema = new Schema({
				username: {
					type: String
				}
			});

			schema.validate({
				username: 'samuel',
				password: '1234'
			});
		}

		expect(createNewSchema).toThrow(
			'The object contains invalid properties: password'
		);
	});

	test('Nested object with properties not specified in the schema throws error message with the correct path to field', () => {
		function createNewSchema() {
			const schema = new Schema({
				address: {
					street: String
				}
			});

			schema.validate({
				address: {
					house: 12
				}
			});
		}

		expect(createNewSchema).toThrow(
			'The object contains invalid properties: address.house'
		);
	});

	describe('Properties are of different type that in the schema', () => {
		test('Incorrect value for a String field', () => {
			function testSchema() {
				const schema = new Schema({
					name: {
						type: String
					}
				});

				schema.validate({
					name: 42
				});
			}

			expect(testSchema).toThrow('The field "name" is not of the correct type');
		});

		test('Incorrect value for a  Number field', () => {
			function testSchema() {
				const schema = new Schema({
					age: {
						type: Number
					}
				});

				schema.validate({
					age: 'Forty Two'
				});
			}

			expect(testSchema).toThrow('The field "age" is not of the correct type');
		});

		test('Incorrect value for a Boolean field', () => {
			function testSchema() {
				const schema = new Schema({
					likesPancakes: {
						type: Boolean
					}
				});

				schema.validate({
					likesPancakes: 'Of course!'
				});
			}

			expect(testSchema).toThrow(
				'The field "likesPancakes" is not of the correct type'
			);
		});
	});

	describe("'enum' is specified, but the value isn't any of the allowed options", () => {
		test('String Type', () => {
			function createNewSchema() {
				const schema = new Schema({
					gender: {
						type: String,
						enum: ['male', 'female']
					}
				});

				schema.validate({
					gender: 'neutral'
				});
			}

			expect(createNewSchema).toThrow(
				'The field "gender" can only be one of: male, female'
			);
		});

		test('Number Type', () => {
			function createNewSchema() {
				const schema = new Schema({
					favoriteNumber: {
						type: Number,
						enum: [42, 84]
					}
				});

				schema.validate({
					favoriteNumber: 34
				});
			}

			expect(createNewSchema).toThrow(
				'The field "favoriteNumber" can only be one of: 42, 84'
			);
		});
	});

	test('Required field is empty', () => {
		function createNewSchema() {
			const schema = new Schema({
				username: {
					type: String,
					required: true
				},
				age: {
					type: Number
				}
			});

			schema.validate({
				age: 24
			});
		}

		expect(createNewSchema).toThrow('The field "username" is required');
	});

	test("Nested object with verbose syntax doens't match the schema", () => {
		function createNewSchema() {
			const schema = new Schema({
				address: {
					type: Object,
					child: {
						city: {
							type: String
						}
					}
				}
			});

			schema.validate({
				address: {
					city: 42
				}
			});
		}

		expect(createNewSchema).toThrow(
			'The field "address.city" is not of the correct type'
		);
	});

	test("Value doesn't match the verbose array schema", () => {
		const arraySchema = new Schema({
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
		});

		function validateSchema() {
			arraySchema.validate({
				arrayOfStuff: [false]
			});
		}

		expect(validateSchema).toThrow(
			'The property "arrayOfStuff[0]" is not of the correct type'
		);
	});

	test('Array with multiple allowed types throws at the correct index(verbose)', () => {
		const arraySchema = new Schema({
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
		});

		function validateSchema() {
			arraySchema.validate({
				arrayOfStuff: ['Samuel', 42, false]
			});
		}

		expect(validateSchema).toThrow(
			'The property "arrayOfStuff[2]" is not of the correct type'
		);
	});

	test('Short object schema syntax', () => {
		const schema = new Schema({
			personalInfoWeStole: {
				address: String,
				phone: Number
			}
		});

		function validateObject() {
			schema.validate({
				personalInfoWeStole: {
					address: 123,
					phone: 'dont need to call'
				}
			});
		}

		expect(validateObject).toThrow(
			'The field "personalInfoWeStole.address" is not of the correct type'
		);
	});

	test('Short array schema syntax', () => {
		const schema = new Schema({
			favoriteStuff: [String]
		});

		function validateObject() {
			schema.validate({
				favoriteStuff: [1, 2, 3]
			});
		}

		expect(validateObject).toThrow(
			'The property "favoriteStuff[0]" is not of the correct type'
		);
	});
});

describe('Custom validators', () => {
	test('Adding a validator works', () => {
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
