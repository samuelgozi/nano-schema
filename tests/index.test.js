const Schema = require('../src/index');

test("Creating a schema with correct syntax doesn't throw", () => {
	const schemaObject = {
		username: {
			type: String,
			required: true
		}
	};

	function createNewSchema() {
		new Schema(schemaObject);
	}

	expect(createNewSchema).not.toThrow();
});

test('Throws when creating a schema with anything other than an object', () => {
	function createNewSchema(input) {
		new Schema(input);
	}

	expect(createNewSchema.bind(undefined, () => {})).toThrow();
});
