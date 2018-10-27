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

test('Empty string doesnt pass validation', () => {
	expect(stringValidator.required('')).toEqual(false);
});
