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
});

describe("Validating object that dons't match a schema", () => {
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

	describe("Throw when 'enum' is specified, but the value isn't any of the allowed options", () => {
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

	test("Throw's when a required field is empty", () => {
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
});

test("Nested object doens't match the schema", () => {
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

describe('Validating array fields', () => {
	test('Value matches the array schema', () => {
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

	test("Value doesn't match the array schema", () => {
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

	test('Combined props with allowed and invalid types throws at the right prop', () => {
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
});
