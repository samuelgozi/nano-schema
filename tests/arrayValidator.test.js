const Schema = require('../src/index');

describe('Array Validator', () => {
	test("validateArray method throws when the `array` argument isn't an array", () => {
		const schema = new Schema({});

		function testValidateArray() {
			schema.validateArray('string');
		}

		expect(testValidateArray).toThrow(
			'Array validator needs the first argument to be an array, instead received "string"'
		);
	});

	test('validateArray method throws when the `schema` argument is empty(undefined)', () => {
		const schema = new Schema({});

		function testValidateArray() {
			schema.validateArray([]);
		}

		expect(testValidateArray).toThrow(
			'Array validator needs the second argument to be the array schema, instead received "undefined"'
		);
	});
});
