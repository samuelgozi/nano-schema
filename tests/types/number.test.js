const numberValidator = require('../../src/types/number');

test('Only numbers pass the "validateType" method', () => {
	// Should pass
	expect(numberValidator.validateType(42)).toEqual(true);

	// Should fail
	expect(numberValidator.validateType(function () {})).toEqual(false);
	expect(numberValidator.validateType(undefined)).toEqual(false);
	expect(numberValidator.validateType(null)).toEqual(false);
	expect(numberValidator.validateType(true)).toEqual(false);
	expect(numberValidator.validateType('str')).toEqual(false);
	expect(numberValidator.validateType('')).toEqual(false);
	expect(numberValidator.validateType({})).toEqual(false);
	expect(numberValidator.validateType([])).toEqual(false);
});

test('Correctly validates numbers in strings when "coerce" is active', () => {
	// Should pass
	expect(numberValidator.validateType('42', { coerce: true })).toEqual(true);

	// Should fail
	expect(
		numberValidator.validateType(function () {}, { coerce: true })
	).toEqual(false);
	expect(numberValidator.validateType(undefined, { coerce: true })).toEqual(
		false
	);
	expect(numberValidator.validateType(null, { coerce: true })).toEqual(false);
	expect(numberValidator.validateType(true, { coerce: true })).toEqual(false);
	expect(numberValidator.validateType('str', { coerce: true })).toEqual(false);
	expect(numberValidator.validateType('', { coerce: true })).toEqual(false);
	expect(numberValidator.validateType({}, { coerce: true })).toEqual(false);
	expect(numberValidator.validateType([], { coerce: true })).toEqual(false);
});
