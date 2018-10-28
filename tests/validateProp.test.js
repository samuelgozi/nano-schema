const Schema = require('../src/index');

describe('Validate Property', () => {
	describe('Enums', () => {
		test("Throws when the value doesn't match any option", () => {
			const schema = new Schema({});

			function validate() {
				schema.validateProp(
					'hi there!',
					{
						type: String,
						enum: ['hello', 'world?']
					},
					'propName'
				);
			}

			expect(validate).toThrow(
				'The field "propName" can only be one of: hello, world?'
			);
		});

		test("Doesn't throw when the field isn't required and the value is empty", () => {
			const schema = new Schema({});

			function validate() {
				schema.validateProp(
					undefined,
					{
						type: String,
						enum: ['hello', 'world?']
					},
					'propName'
				);
			}

			expect(validate).not.toThrow();
		});
	});
});
