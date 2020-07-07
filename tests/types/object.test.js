const objectValidator = require('../../src/types/object');

test('Only objects pass the "validateType" method', () => {
	// Should pass
	expect(objectValidator.validateType({})).toEqual(true);

	// Should fail
	expect(objectValidator.validateType(function () {})).toEqual(false);
	expect(objectValidator.validateType(undefined)).toEqual(false);
	expect(objectValidator.validateType('str')).toEqual(false);
	expect(objectValidator.validateType(true)).toEqual(false);
	expect(objectValidator.validateType(null)).toEqual(false);
	expect(objectValidator.validateType('')).toEqual(false);
	expect(objectValidator.validateType([])).toEqual(false);
});
