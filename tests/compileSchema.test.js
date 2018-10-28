const Schema = require('../src/index');

describe('Schema Compiler', () => {
	test('Throws when providing an invalid type', () => {
		const schema = new Schema({});

		function testVerbose() {
			schema.compileSchemaField({
				name: {
					type: 'whatever'
				}
			});
		}

		function testShort() {
			schema.compileSchemaField({ name: 'whatever' });
		}

		expect(testVerbose).toThrow('Invalid type for the field "name"');
		expect(testShort).toThrow('Invalid type for the field "name"');
	});

	test('compileSchemaField converts shortcuts into verbose syntax', () => {
		const schema = new Schema({});

		expect(schema.compileSchemaField(String, 'propName')).toEqual({
			type: String
		});

		expect(schema.compileSchemaField(Number, 'propName')).toEqual({
			type: Number
		});

		expect(schema.compileSchemaField(Boolean, 'propName')).toEqual({
			type: Boolean
		});

		expect(schema.compileSchemaField(Date, 'propName')).toEqual({
			type: Date
		});

		expect(schema.compileSchemaField(Array, 'propName')).toEqual({
			type: Array
		});

		expect(schema.compileSchemaField(Object, 'propName')).toEqual({
			type: Object
		});
	});

	test('compileSchemaField converts object and array short syntax into verbose', () => {
		const schema = new Schema({});

		expect(schema.compileSchemaField([String], 'propName')).toEqual({
			type: Array,
			child: [
				{
					type: String
				}
			]
		});

		expect(schema.compileSchemaField({ name: String }, 'propName')).toEqual({
			type: Object,
			child: {
				name: {
					type: String
				}
			}
		});
	});

	test('compileSchemaField correcty identifies objects that are neither shortcuts or types', () => {
		const schema = new Schema({});

		function testSyntax() {
			schema.compileSchemaField(
				{
					name: 'Slim Shady'
				},
				'propName'
			);
		}

		expect(testSyntax).toThrow('Invalid type for the field "propName.name"');
	});

	test('compileSchemaField throws when there are unknown/unallowed props', () => {
		const schema = new Schema({});

		function validate() {
			schema.compileSchemaField(
				{
					type: String,
					imNotWanted: 'but why?'
				},
				'test'
			);
		}

		expect(validate).toThrow('Unknown property "test.imNotWanted"');
	});

	test('compileSchemaField throws when the required prop is not a boolean', () => {
		const schema = new Schema({});

		function validate() {
			schema.compileSchemaField(
				{
					type: String,
					required: 'yes please!'
				},
				'test'
			);
		}

		expect(validate).toThrow('The prop "test.required" should be a Boolean');
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

		expect(testEnum).toThrow('The prop "test.enum" should be an Array');
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
			'The enum at "test.enum[0]" doesn\'t match the schema type'
		);

		expect(testNumber).toThrow(
			'The enum at "test.enum[0]" doesn\'t match the schema type'
		);
	});

	test('compileSchema returns a verbose schema', () => {
		const schema = new Schema({});
		const shortSchema = {
			name: String,
			favoriteStuff: [String],
			contactInfo: {
				address: String,
				phone: Number
			}
		};

		expect(schema.compileSchema(shortSchema)).toEqual({
			name: {
				type: String
			},
			favoriteStuff: {
				type: Array,
				child: [
					{
						type: String
					}
				]
			},
			contactInfo: {
				type: Object,
				child: {
					address: {
						type: String
					},
					phone: {
						type: Number
					}
				}
			}
		});
	});
});
