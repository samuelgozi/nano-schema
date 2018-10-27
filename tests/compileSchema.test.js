const Schema = require('../src/index');

describe('Schema Compiler', () => {
	test('compileSchemaField throws when there are unknown/unallowed props', () => {
		const schema = new Schema({});

		function testValidateArray() {
			schema.compileSchemaField(
				{
					type: String,
					imNotWanted: 'but why?'
				},
				'test'
			);
		}

		expect(testValidateArray).toThrow('Unknown property "imNotWanted"');
	});

	test('compileSchemaField throws when the required prop is not a boolean', () => {
		const schema = new Schema({});

		function testValidateArray() {
			schema.compileSchemaField(
				{
					type: String,
					required: 'yes please!'
				},
				'test'
			);
		}

		expect(testValidateArray).toThrow(
			'Property named "required" should be of type boolean'
		);
	});

	test('compileSchemaField throws when any of the enums prop is not an array', () => {
		const schema = new Schema({});

		function testEnum() {
			schema.compileSchemaField(
				{
					type: String,
					enum: 'this or that'
				},
				'test'
			);
		}

		expect(testEnum).toThrow('Property named "enum" should be of type Array');
	});

	test('compileSchemaField throws when any of the enums is not of the expected type', () => {
		const schema = new Schema({});

		function testString() {
			schema.compileSchemaField(
				{
					type: String,
					enum: [42]
				},
				'test'
			);
		}

		function testNumber() {
			schema.compileSchemaField(
				{
					type: Number,
					enum: ['Forty two']
				},
				'test'
			);
		}

		expect(testString).toThrow(
			'All the options inside the enum should be of the correct type'
		);

		expect(testNumber).toThrow(
			'All the options inside the enum should be of the correct type'
		);
	});
});
