const Schema = require('../src/index');

describe('Array Validator', () => {
	test("Throws when the `array` argument isn't an array", () => {
		const schema = new Schema({});

		function testValidateArray() {
			schema.validateArray('string');
		}

		expect(testValidateArray).toThrow(
			'Array validator needs the first argument to be an array, instead received "string"'
		);
	});

	test('Throws when the `schema` argument is empty(undefined)', () => {
		const schema = new Schema({});

		function testValidateArray() {
			schema.validateArray([]);
		}

		expect(testValidateArray).toThrow(
			'Array validator needs the second argument to be the array schema, instead received "undefined"'
		);
	});

	test("Doesn't throw when the value is of the correct type", () => {
		const schema = new Schema({});

		function testValidateArray() {
			const arraySchema = {
				type: Array,
				child: [
					{
						type: String
					}
				]
			};

			schema.validateArray(['Hello', 'World!'], arraySchema, 'myArray');
		}

		expect(testValidateArray).not.toThrow();
	});

	test("Throws when the value doesn't matches any type in the array schema", () => {
		const schema = new Schema({});

		function testValidateArray() {
			const arraySchema = {
				type: Array,
				child: [
					{
						type: String
					}
				]
			};

			schema.validateArray(['Hello', 42], arraySchema, 'myArray');
		}

		expect(testValidateArray).toThrow(
			'The property "myArray[1]" is not of the correct type'
		);
	});

	test("Doesn't throw when the schema doesn't contain any type", () => {
		const schema = new Schema({});

		function testValidateArray() {
			const arraySchema = {
				type: Array,
				child: []
			};

			schema.validateArray([], arraySchema, 'myArray');
		}

		expect(testValidateArray).not.toThrow();
	});

	test('Throws when the array is required, but left empty', () => {
		function testValidateArray() {
			const schema = new Schema({
				myArray: {
					type: Array,
					required: true
				}
			});

			schema.validate({
				myArray: []
			});
		}

		expect(testValidateArray).toThrow(
			'The array "myArray" is required, but left empty'
		);
	});
});
