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

// Helper to check if a field is a plain Object.
function isObject(value) {
	return Object.prototype.toString.apply(value) === '[object Object]';
}

class Schema {
	constructor(schema) {
		// Verify that the input is an Object.
		if (Object.prototype.toString.call(schema) !== '[object Object]')
			throw Error('Schema must be an object');

		// Validate that the schema is formatted correctly
		// and compile shortcuts into the verbose syntax.
		const compiledSchema = this.compileSchema(schema);

		// Save it for reference.
		this.__schema = compiledSchema;
	}

	static get validators() {
		return validators;
	}

	/*
	 * Compile short schema syntax into verbose one.
	 */
	compileSchemaField(fieldSchema, fieldName) {
		// Check if the prop is using the shortcut syntax, if it is
		// then replace it with a schema that uses the verbose syntax.
		// This check only works for "primitive" types.
		if (validators.has(fieldSchema)) {
			fieldSchema = { type: fieldSchema };
		}

		// Add a `child` prop if its undefined in arrays and objects.
		if (
			(fieldSchema.type === Object || fieldSchema.type === Array) &&
			fieldSchema.child === undefined
		) {
			fieldSchema.child = fieldSchema.type === Object ? {} : [];
		}

		// Check if the value uses a short syntax for the
		// Array schema, if it is then replace it with the verbose syntax.
		if (Array.isArray(fieldSchema)) {
			fieldSchema = {
				type: Array,
				child: fieldSchema
			};
		}

		// If the field schema is an object and doesn't have a type
		// property then its an object shortcut, replace is with verbose syntax.
		if (isObject(fieldSchema) && fieldSchema.type === undefined) {
			fieldSchema = {
				type: Object,
				child: fieldSchema
			};
		}

		// If it is an object, compile its child properties.
		if (fieldSchema.type === Object) {
			fieldSchema.child = this.compileSchema(fieldSchema.child, fieldName);
		}

		// If it is an array, compile its child properties.
		if (fieldSchema.type === Array) {
			fieldSchema.child = fieldSchema.child.map((schema, index) =>
				this.compileSchemaField(schema, `${fieldName}[${index}]`)
			);
		}

		// Get the validator of the schema.
		const typeValidator = validators.get(fieldSchema.type);

		// If no validator was found, then throw an error.
		if (typeValidator === undefined) {
			throw Error(`Invalid type for the field "${fieldName}"`);
		}

		// Validate that the schema contain only allowed values.
		const allowedProps = typeValidator.allowedProps;

		for (let prop in fieldSchema) {
			// If the property is "type" then continue
			// to the next iteration, its always required.
			if (prop === 'type') continue;

			// Check if the property is allowed.
			if (!allowedProps.includes(prop)) {
				throw Error(`Unknown property "${fieldName}.${prop}"`);
			}

			// Verify that 'required' is a Boolean.
			if (prop === 'required') {
				if (typeof fieldSchema.required !== 'boolean') {
					throw Error(`The prop "${fieldName}.${prop}" should be a Boolean`);
				}
			}

			if (prop === 'enum') {
				// Verify that enum is an Array.
				if (!Array.isArray(fieldSchema.enum)) {
					throw Error(`The prop "${fieldName}.${prop}" should be an Array`);
				}

				// Verify that all the options inside the the enum are of the correct type.
				for (let index in fieldSchema.enum) {
					if (
						!typeValidator.validateType(fieldSchema.enum[index], fieldSchema)
					) {
						throw Error(
							`The enum at "${fieldName}.${prop}[${index}]" doesn't match the schema type`
						);
					}
				}
			}
		}

		// Validate the compiled field schema.
		if (typeValidator.validateSchema !== undefined) {
			typeValidator.validateSchema(fieldSchema, fieldName);
		}

		// finally return the compiled schema
		// (or the original if it wasn't changed)
		return fieldSchema;
	}

	/*
	 * Validates that a schema is formatted correctly
	 * and compiles shortcuts into the verbose syntax.
	 */
	compileSchema(schema = this.__schema, parentField) {
		const compiledSchema = {};

		for (const fieldName in schema) {
			// Compose a field name including the parent for better debugging.
			const fieldPath =
				parentField !== undefined ? parentField + '.' + fieldName : fieldName;

			// Compile the field, and save it.
			// "compiling" is needed because a field might use a shortcut.
			const compiledField = this.compileSchemaField(
				schema[fieldName],
				fieldPath
			);

			// Add to the new compiled schema.
			compiledSchema[fieldName] = compiledField;
		}

		return compiledSchema;
	}

	/*
	 * Validate a value against a field schema.
	 */
	validateProp(value, schema, propName, parentProp) {
		// If the value is empty(undefined), and isn't required,
		// then there is no need for additional tests, just return.
		if (value === undefined && schema.required !== true) {
			return;
		}

		// Get the validator for the type of the schema.
		const validator = validators.get(schema.type);
		// Full path to the field, needed for easier debugging of nested schemas.
		const propPath =
			parentProp !== undefined ? parentProp + '.' + propName : propName;

		// If the field is not undefined or it is required, then validate its type.
		// We do this check because we are iterating over the schema, not the object itself.
		if (value !== undefined || schema.required === true) {
			const isValid = validator.validateType(value, schema);

			if (!isValid) {
				if (schema.required === true) {
					throw { propPath, message: 'The field is required' };
				}

				throw { propPath, message: 'The field is not of the correct type' };
			}
		}

		// Check the the value matches an 'enum' when enum is specified.
		if (schema.enum !== undefined) {
			const valueMatchesEnum = schema.enum.includes(value);

			if (!valueMatchesEnum) {
				throw {
					propPath,
					message: `The field can only be one of: ${schema.enum.join(', ')}`
				};
			}
		}

		// If the field is an object then recursively run the validator on it.
		if (schema.type === Object) {
			this.validate(value, schema.child, propName, schema.required);
		}

		if (schema.type === Array) {
			this.validateArray(value, schema, propName);
		}
	}

	/*
	 * Validates that an array of values matches
	 * at least one schema in an array of schemas.
	 */
	// TODO: refactor the code to be simpler.
	validateArray(array, schema, propName) {
		// Validate the inputs.
		if (!Array.isArray(array))
			throw Error(
				`Array validator needs the first argument to be an array, instead received "${typeof array}"`
			);

		if (schema === undefined)
			throw Error(
				`Array validator needs the second argument to be the array schema, instead received "${typeof schema}"`
			);

		// If all types are allowed, return.
		if (schema.child.length === 0 && schema.required !== true) {
			return;
		}

		// If the array is required but left empty, throw an error.
		if (schema.required === true && array.length === 0) {
			throw { propPath: propName, message: 'The field is required' };
		}

		// Map of the property names and its errors(if any).
		const errors = new Map();

		for (const index in array) {
			const value = array[index];
			const indexPropName = `[${index}]`;
			let propItemMatched = false;

			for (const fieldSchema of schema.child) {
				try {
					this.validateProp(value, fieldSchema, indexPropName, propName);

					// If the validation didn't throw then it means
					// that the value matched the schema, we can break and move into the next array value.
					// Update the 'propItemMatched' to tell the outer loop to move into the next value.
					propItemMatched = true;
					break;
				} catch (e) {
					// Else if the validation throwed, then we need to keep checking.
					continue;
				}
			}

			// If the current property matched a valid schema, then move into the next prop.
			if (propItemMatched) continue;

			// If no validation worked(the function would've
			// returned, and never get here), Then add en error to the errors set.
			throw errors.set(
				propName + indexPropName,
				'The field is not of the correct type'
			);
		}
	}

	/*
	 * Validates an object and all of its fields against a schema.
	 */
	validate(object, schema = this.__schema, fieldParent, isRequired) {
		let errors = new Map();

		// Used to track which props were validated.
		const objectProps = new Set(Object.keys(object));

		// If the object is required(it means that
		// this is a recursive call, and the object type
		// has required set to true), then throw if it is empty.
		if (isRequired === true && objectProps.size === 0) {
			throw Error(`The object "${fieldParent}" is required, but left empty`);
		}

		// Loop over the keys in the schema(not over the object to validate).
		for (const fieldName in schema) {
			const fieldValue = object[fieldName];
			const fieldSchema = schema[fieldName];

			try {
				// Validate the prop against its field schema.
				this.validateProp(fieldValue, fieldSchema, fieldName, fieldParent);
			} catch (error) {
				// Else it is a validation error then add it to the errors list.
				if (error instanceof Map) {
					errors = new Map([...errors, ...error]);

					// Remove the prop from the list of properties left in the object.
					objectProps.delete(fieldName);

					// Jump to the next loop
					continue;
				}

				// If this is not a validation error, then throw it.
				if (error.propPath === undefined) throw error;

				// Add the error into the errors set.
				errors.set(error.propPath, error.message);
			}

			// Remove the prop from the list of properties left in the object.
			objectProps.delete(fieldName);
		}

		// If there are still props in the list of properties checked
		// it means that the object has props that were not specified in the schema.
		if (objectProps.size > 0) {
			let invalidProps = Array.from(objectProps);

			// If this is a recursive call, then we append the
			// parent field name to the prop to make it easier to debug.
			if (fieldParent !== undefined) {
				invalidProps = invalidProps.map(prop => fieldParent + '.' + prop);
			}

			for (const prop of invalidProps) {
				errors.set(prop, 'Unknown property');
			}
		}

		// If there are errors in the set, throw it.
		if (errors.size > 0) throw errors;
	}
}

module.exports = Schema;
