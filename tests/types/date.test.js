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
