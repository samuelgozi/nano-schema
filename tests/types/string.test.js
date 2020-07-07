const stringValidator = require('../../src/types/string');
const Schema = require('../../src/index');

describe('Strings', () => {
	test('Only strings pass the "test" method', () => {
		// Should pass
		expect(stringValidator.validateType('this is a string')).toEqual(true);

		// Should fail
		expect(stringValidator.validateType(function () {})).toEqual(false);
		expect(stringValidator.validateType(undefined)).toEqual(false);
		expect(stringValidator.validateType(null)).toEqual(false);
		expect(stringValidator.validateType(true)).toEqual(false);
		expect(stringValidator.validateType(42)).toEqual(false);
		expect(stringValidator.validateType({})).toEqual(false);
		expect(stringValidator.validateType([])).toEqual(false);
	});

	test('Throws when test is not a RegExp', () => {
		function invalid() {
			new Schema({
				name: {
					type: String,
					test: []
				}
			});
		}

		function valid() {
			new Schema({
				name: {
					type: String,
					test: /RegExp/
				}
			});
		}

		expect(invalid).toThrow(
			'The "test" option in the field "name" should be a RegExp'
		);

		expect(valid).not.toThrow();
	});

	test("Validates against the RegExp specified in the 'test' option", () => {
		expect(
			stringValidator.validateType('random...', { test: /Slim Shady/ })
		).toEqual(false);

		expect(
			stringValidator.validateType('Slim Shady', { test: /Slim Shady/ })
		).toEqual(true);
	});

	test('IsEmpty returns true when is passed an empty string', () => {
		expect(stringValidator.isEmpty('')).toEqual(true);
	});
});
