const stringValidator = require('./types/string');
const numberValidator = require('./types/number');
const booleanValidator = require('./types/boolean');
const dateValidator = require('./types/date');
const arrayValidator = require('./types/array');
const objectValidator = require('./types/object');

const validators = new Map([
	[String, stringValidator],
	[Number, numberValidator],
	[Boolean, booleanValidator],
	[Date, dateValidator],
	[Array, arrayValidator],
	[Object, objectValidator]
]);

class Schema {
	constructor(schema) {
		// Verify that the input is an Object.
		if (Object.prototype.toString.call(schema) !== '[object Object]')
			throw Error('Schema must be an object');

		// Validate that the schema is formatted correctly.
		this.validateSchema(schema);

		// Save it for reference.
		this.__schema = schema;
	}

	/*
	 * Validates that a schema is formatted correctly.
	 */
	validateSchema(schema = this.__schema) {
		for (const propName in schema) {
			const prop = schema[propName];
			const typeValidator = validators.get(prop.type);

			typeValidator.validateSchema(prop);
		}
	}

	/*
	 * Valdidates a given object against the schema.
	 */
	validate(object, schema = this.__schema) {
		// Used to track which props were validated.
		const objectProps = new Set(Object.keys(object));

		// Loop over the keys in the schema(on it the object to validate).
		for (const fieldName in schema) {
			const fieldValue = object[fieldName];
			const schemaField = schema[fieldName];
			const validator = validators.get(schemaField.type);

			// If the field is required, validate that its not empty.
			if (schemaField.required === true) {
				// If the schema validator provided a specific
				// method for checking required fields, then use it.
				const validateRequired =
					validator.required !== undefined
						? validator.required
						: validator.validateType;

				// Bind the function to the validator object to allow `this` access.
				const fieldIsEmpty = !validateRequired.call(validator, fieldValue);

				if (fieldIsEmpty) {
					throw Error(`The field "${fieldName}" is required`);
				}
			}

			// Check the the value matches an 'enum' when enum is declared.
			if (schemaField.enum !== undefined) {
				if (!schemaField.enum.includes(fieldValue)) {
					throw Error(
						`The field "${fieldName}" can only be one of: ${schemaField.enum.join(
							', '
						)}`
					);
				}
			}

			// Remove the prop from the list of properties left in the object.
			objectProps.delete(fieldName);
		}

		// If there are still props in the list of properties checked
		// it means that the object has props that were not specified in the schema.
		if (objectProps.size > 0) {
			const invalidProps = Array.from(objectProps).join(', ');
			throw Error('The object contains invalid properties: ' + invalidProps);
		}
	}
}

module.exports = Schema;
