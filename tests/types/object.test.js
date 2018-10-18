const objectValidator = require('../../src/types/object');

test('Only objects pass the "validateType" method', () => {
	// Should pass
	expect(objectValidator.validateType({})).toEqual(true);

	// Should fail
	expect(objectValidator.validateType(function() {})).toEqual(false);
	expect(objectValidator.validateType(undefined)).toEqual(false);
	expect(objectValidator.validateType('str')).toEqual(false);
	expect(objectValidator.validateType(true)).toEqual(false);
	expect(objectValidator.validateType(null)).toEqual(false);
	expect(objectValidator.validateType('')).toEqual(false);
	expect(objectValidator.validateType([])).toEqual(false);
});

test('Schema validator with unknown props throws', () => {
	const stringSchema = {
		type: Boolean,
		required: true,
		banana: 'banana?'
	};

	function validate() {
		objectValidator.validateSchema(stringSchema);
	}

	expect(validate).toThrowError('Unknown property "banana"');
});

test("Schema validator doesn't throw when all fields are valid", () => {
	const stringSchema = {
		type: Boolean,
		required: true
	};

	function validate() {
		objectValidator.validateSchema(stringSchema);
	}

	expect(validate).not.toThrow();
});
