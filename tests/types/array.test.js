const arrayValidator = require('../../src/types/array');

test('Only booleans pass the "validateType" method', () => {
	// Should pass
	expect(arrayValidator.validateType([])).toEqual(true);

	// Should fail
	expect(arrayValidator.validateType(function() {})).toEqual(false);
	expect(arrayValidator.validateType(undefined)).toEqual(false);
	expect(arrayValidator.validateType('str')).toEqual(false);
	expect(arrayValidator.validateType(true)).toEqual(false);
	expect(arrayValidator.validateType(null)).toEqual(false);
	expect(arrayValidator.validateType('')).toEqual(false);
	expect(arrayValidator.validateType({})).toEqual(false);
});

test('Schema validator with unknown props throws', () => {
	const stringSchema = {
		type: Boolean,
		required: true,
		banana: 'banana?'
	};

	function validate() {
		arrayValidator.validateSchema(stringSchema);
	}

	expect(validate).toThrowError('Unknown property "banana"');
});

test("Schema validator doesn't throw when all fields are valid", () => {
	const stringSchema = {
		type: Boolean,
		required: true
	};

	function validate() {
		arrayValidator.validateSchema(stringSchema);
	}

	expect(validate).not.toThrow();
});
