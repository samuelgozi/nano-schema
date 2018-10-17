const stringValidator = require('../../src/types/string');

test('Only strings pass the "test" method', () => {
	// Should pass
	expect(stringValidator.validateType('this is a string')).toEqual(true);
	expect(stringValidator.validateType('')).toEqual(true);

	// Should fail
	expect(stringValidator.validateType(function() {})).toEqual(false);
	expect(stringValidator.validateType(undefined)).toEqual(false);
	expect(stringValidator.validateType(null)).toEqual(false);
	expect(stringValidator.validateType(true)).toEqual(false);
	expect(stringValidator.validateType(42)).toEqual(false);
	expect(stringValidator.validateType({})).toEqual(false);
	expect(stringValidator.validateType([])).toEqual(false);
});

test('Required method returns false on empty values', () => {
	expect(stringValidator.required('')).toEqual(false);
	expect(stringValidator.required(null)).toEqual(false);
	expect(stringValidator.required(undefined)).toEqual(false);
});

test('When enum is provided only allowed strings should pass', () => {
	const options = ['one', 'two', 'three'];

	expect(stringValidator.enum('one', options)).toEqual(true);
	expect(stringValidator.enum('two', options)).toEqual(true);
	expect(stringValidator.enum('three', options)).toEqual(true);

	// should fail
	expect(stringValidator.enum('four', options)).toEqual(false);
});

test('All the options inside the the enum are of the correct type', () => {
	const schema = {
		enum: ['one', 2, 'three']
	};

	function validateSchema() {
		stringValidator.validateSchema(schema);
	}

	expect(validateSchema).toThrow();
});

test('Schema validator with unknown props throws', () => {
	const stringSchema = {
		type: String,
		required: true,
		enum: [],
		banana: 'banana?'
	};

	function validate() {
		stringValidator.validateSchema(stringSchema);
	}

	expect(validate).toThrowError('Unknown property "banana"');
});

test("Schema validator doesn't throw when all fields are valid", () => {
	const stringSchema = {
		type: String,
		required: true,
		enum: []
	};

	function validate() {
		stringValidator.validateSchema(stringSchema);
	}

	expect(validate).not.toThrow();
});
