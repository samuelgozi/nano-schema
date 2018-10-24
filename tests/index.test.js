const Schema = require('../src/index');

describe("Creating a schema with correct syntax doesn't throw", () => {
	test('Verbose schema syntax', () => {
		const schemaObject = {
			username: {
				type: String,
				required: true
			}
		};

		function createNewSchema() {
			new Schema(schemaObject);
		}

		expect(createNewSchema).not.toThrow();
	});

	// test('Shortcut schema syntax', () => {
	// 	const schemaObject = {
	// 		username: String
	// 	};

	// 	function createNewSchema() {
	// 		new Schema(schemaObject);
	// 	}

	// 	expect(createNewSchema).not.toThrow();
	// });
});

test('Throws when creating a schema with anything other than an object', () => {
	function createNewSchema() {
		new Schema(() => {});
	}

	expect(createNewSchema).toThrow('Schema must be an object');
});

test("Doesn't throw when validating an object that matches the schema", () => {
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

test('Throws when the object contains properties not specified in the schema', () => {
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

describe('Throws when creating a schema with invalid field options', () => {
	test('Invalid option in "String" type', () => {
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
});

describe('Throws when the type of the property is not correct', () => {
	test('String', () => {
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

	test('Number', () => {
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

	test('Boolean', () => {
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

test("Correct values with 'enum' don't throw", () => {
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

describe('Nested schemas', () => {
	test("Throws when the nested object doens't match the schema", () => {
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
});
