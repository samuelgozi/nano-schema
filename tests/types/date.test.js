const dateValidator = require('../../src/types/date');

test('Only valid dates pass the "validateType" method', () => {
	// Should pass
	expect(dateValidator.validateType('04 Dec 1995 00:12:00 GMT')).toEqual(true);
	expect(dateValidator.validateType(Date.now())).toEqual(true);

	// Should fail
	expect(dateValidator.validateType('04 Dud 1995 00:12:00 GMT')).toEqual(false);
	expect(dateValidator.validateType('42 Dec 1995 00:12:00 GMT')).toEqual(false);
	expect(dateValidator.validateType(function() {})).toEqual(false);
	expect(dateValidator.validateType(undefined)).toEqual(false);
	expect(dateValidator.validateType(null)).toEqual(false);
	expect(dateValidator.validateType('str')).toEqual(false);
	expect(dateValidator.validateType('')).toEqual(false);
	expect(dateValidator.validateType({})).toEqual(false);
	expect(dateValidator.validateType([])).toEqual(false);
});

test('Schema validator with unknown props throws', () => {
	const stringSchema = {
		type: Boolean,
		required: true,
		banana: 'banana?'
	};

	function validate() {
		dateValidator.validateSchema(stringSchema);
	}

	expect(validate).toThrowError('Unknown property "banana"');
});

test("Schema validator doesn't throw when all fields are valid", () => {
	const stringSchema = {
		type: Boolean,
		required: true
	};

	function validate() {
		dateValidator.validateSchema(stringSchema);
	}

	expect(validate).not.toThrow();
});

test("Schema validator throws when the required value isn't a boolean", () => {
	function validate() {
		dateValidator.validateSchema({
			type: Date,
			required: 'yes please!'
		});
	}

	expect(validate).toThrow(
		'Property named "required" should be of type boolean'
	);
});
