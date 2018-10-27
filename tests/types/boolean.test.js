const booleanValidator = require('../../src/types/boolean');

test('Only booleans pass the "validateType" method', () => {
	// Should pass
	expect(booleanValidator.validateType(true)).toEqual(true);
	expect(booleanValidator.validateType(false)).toEqual(true);

	// Should fail
	expect(booleanValidator.validateType(function() {})).toEqual(false);
	expect(booleanValidator.validateType(undefined)).toEqual(false);
	expect(booleanValidator.validateType(null)).toEqual(false);
	expect(booleanValidator.validateType('str')).toEqual(false);
	expect(booleanValidator.validateType('')).toEqual(false);
	expect(booleanValidator.validateType({})).toEqual(false);
	expect(booleanValidator.validateType([])).toEqual(false);
});
