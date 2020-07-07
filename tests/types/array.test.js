const arrayValidator = require('../../src/types/array');

test('Only arrays pass the "validateType" method', () => {
	// Should pass
	expect(arrayValidator.validateType([])).toEqual(true);

	// Should fail
	expect(arrayValidator.validateType(function () {})).toEqual(false);
	expect(arrayValidator.validateType(undefined)).toEqual(false);
	expect(arrayValidator.validateType('str')).toEqual(false);
	expect(arrayValidator.validateType(true)).toEqual(false);
	expect(arrayValidator.validateType(null)).toEqual(false);
	expect(arrayValidator.validateType('')).toEqual(false);
	expect(arrayValidator.validateType({})).toEqual(false);
});
