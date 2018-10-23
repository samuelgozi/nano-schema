const numberValidator = require('../../src/types/number');

test('Only numbers pass the "validateType" method', () => {
	// Should pass
	expect(numberValidator.validateType(42)).toEqual(true);

	// Should fail
	expect(numberValidator.validateType(function() {})).toEqual(false);
	expect(numberValidator.validateType(undefined)).toEqual(false);
	expect(numberValidator.validateType(null)).toEqual(false);
	expect(numberValidator.validateType(true)).toEqual(false);
	expect(numberValidator.validateType('str')).toEqual(false);
	expect(numberValidator.validateType('')).toEqual(false);
	expect(numberValidator.validateType({})).toEqual(false);
	expect(numberValidator.validateType([])).toEqual(false);
});

test('All the options inside the the enum are of the correct type', () => {
	const schema = {
		enum: [1, NaN, 3]
	};

	function validateSchema() {
		numberValidator.validateSchema(schema);
	}

	expect(validateSchema).toThrow(
		'All the options inside the enum should be of the correct type'
	);
});

test('When enum is provided only allowed options should pass', () => {
	const options = [1, 2, 3];

	expect(numberValidator.enum(1, options)).toEqual(true);
	expect(numberValidator.enum(2, options)).toEqual(true);
	expect(numberValidator.enum(3, options)).toEqual(true);

	// should fail
	expect(numberValidator.enum(42, options)).toEqual(false);
});

test('Schema validator with unknown props throws', () => {
	const stringSchema = {
		type: String,
		required: true,
		enum: [],
		banana: 'banana?'
	};

	function validate() {
		numberValidator.validateSchema(stringSchema);
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
		numberValidator.validateSchema(stringSchema);
	}

	expect(validate).not.toThrow();
});
