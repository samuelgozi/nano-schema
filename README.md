[![Build Status](https://travis-ci.org/samuelgozi/nano-schema.svg?branch=master)](https://travis-ci.org/samuelgozi/nano-schema)
[![codecov](https://codecov.io/gh/samuelgozi/nano-schema/branch/master/graph/badge.svg)](https://codecov.io/gh/samuelgozi/nano-schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# Nano-schema

Nano schema helps you validate that JavaScript objects match a schema.
The goal of the project was to create a lightweight, high performance and extensible library with no dependencies.
The current size of this library is: **1.25KB**

## Installation

```
npm install nano-schema
```

or if (like me) you use Yarn:

```
yarn add nano-schema
```

## How to use

Let's start with an example:

```js
const schema = new Schema({
  name: String,
  age: Number,
  familyMembers: [String],
  address: {
    city: String,
    street: String,
  },
});
```

Let's break it down.
The schema we created above will put the next constraints in place:

- `object.name` - Can only be a String
- `object.age` - Can only be a Number
- `object.familyMembers` - Can only be an Array, and its list items can only be of type String.
- `object.address` - Can only be an Object, and its only allowed props are `city` and `street` and both on them must be of type String.
  In this example, there are no other constraints on the schema, non of the fields is required or has any additional restrictions.

### Now, how do I validate my object?

Its very simple, in order to verify that an object passes all the constraints we need to use the `validate` method:

```js
schema.validate({
  name: "Samuel",
  age: "23",
  familyMembers: ["brother name", "sister name", "etc"],
  address: {
    city: "Tel-Aviv",
    address: "Hertzel!!!",
  },
});
```

If the passed object adheres to the schema, then the method will not throw an error.

### What happens if the validation fails?

When an object fails to validate, the `validate` method will throw an error with a message explaining exactly how the validation failed, and what property caused the error.

Let's show an example with the schema above:

```js
schema.validate({
  /* ... */
  address: {
    city: 42,
  },
  /* ... */
});
```

In this object, everything is valid except `object.address.city`, so the `validate` method will throw:
`The property "address.city" is not of the correct type`

### Adding additional constrains for a field

Up until now we have seen how to set up a field with only the "Type" constrain,
But what happens when we want to add additional constrains? Well, it's very simple,
instead of using the "short" syntax we used before, we are going to use the "verbose" one.
But don't worry! it's still easy!

So, let's say we want to make a field be required, here is how we do that:

```js
const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});
```

As you can see, it's pretty straightforward.
Instead of using the "short" field syntax, we use the "verbose" one, which means
that instead of writing `name: String`, we provide an object that has a `type` property, and any additional options
that the type we want to use supports, in this example we added `required`.

## Short vs verbose syntax

There are two ways of specifying a "Field schema". One is short and easier to read, and the second one is "verbose" and is used when we want additional constrains on that field. like `required`, `enum` etc.

Here is an example of how we would use the "short" syntax to create a field that should be of type `String`:

```js
const schema = new Schema({
  name: String,
});
```

As you can see it's pretty easy to read, and self explanatory.

The verbose version of the same "Field schema" would be:

```js
const schema = new Schema({
  name: {
    type: String,
  },
});
```

The validation will work exactly the same for both syntaxes. In fact, behind the scenes, the short version
will be converted into the verbose one. So, it's practically the same.

With the `Object` and `Array` types the short and verbose version will look like this:
**Array**

```js
// Short
const schema = new Schema({
  favoriteMovies: [String],
});

// Verbose
const schema = new Schema({
  favoriteMovies: {
    type: Array,
    child: [
      {
        type: String,
      },
    ],
  },
});
```

**Object**

```js
// Short
const schema = new Schema({
  address: {
    city: String,
    street: String,
  },
});

// Verbose
const schema = new Schema({
  address: {
    type: Object,
    child: {
      city: {
        type: String,
      },
      street: {
        type: String,
      },
    },
  },
});
```

As you can see in the later examples, the difference is significant. But the verbose syntax is needed because sometimes we need to add constrains to the fields.

## What types are supported?

The built in types are: `String`, `Number`, `Boolean`, `Date`, `Array` and `Object`.

Each type has additional options, this is not a final list, and more will be added in the near future.

**`String`**

- `required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
  An empty string is considered empty, and will throw.
- `enum` - Array. Should be an array of strings that are allowed. Any other string will throw an error at validation.
  All the enum options must of the correct type or an error will be thrown on schema creation.
- `test` - RegExp. When specified, the string must match the regular expression in order to pass validation.

**`Number`**

- `required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
- `enum` - Array. Should be an array of strings that are allowed. Any other string will throw an error at validation.
  All the enum options must of the correct type or an error will be thrown on schema creation.
- `coerce` - Should the validator try to coerce the value into a number? This could be very helpful when trying to validate the values of a form.

**`Boolean`.**

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.

**`Date`**
A valid date is any date that JavaScript can parse and result in a valid date object.

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.

**`Array`**

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
- `child` - Array. An array of schema fields that can be included in the array. So if a value matches any of them it is allowed. But if the schema doesn't match any of the provided field schemas then the validator will throw with an error specifying exactly which index threw.

**`Object`**

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
  Please note that currently an empty object will pass validation.
- `child` - A sub schema object (Like the one passed to the `new Schema()` constructor).

### Creating a custom type

A type is just an object with some methods that the schema class will invoke when needed.
Here is a simplified example of how it would look (explanation below).

```js
const customType = {
  allowedProps: ["required", "enum", "etc"],

  validateType(value, schema) {
    /* ... */
  },

  validateSchema(schema) {
    /* ...  */
  },
};
```

Yep, it's that simple. Each property has a specific role. Here is an explanation of what each of them does.

- `allowedProps` - An array that lists all the allowed properties in the type schema, excluding 'type' and 'meta' which are reserved, and added automatically.
- `validateType` - This method is the one that should contain the logic to allow or reject a value. It should return a Boolean, `true` if the value matches and `false` otherwise.
  The method will receive the value itself, and the schema options for the field.
- `validateSchema` - This method is invoked when a schema class is instantiated, and it is used to check that the schema was written correctly and doesn't contain any invalid props or typos.

Please note that only`validateType` and `allowedProps` props are required, your type does not need to support `required` or `enum`, and shouldn't have a `validateSchema` method unless it adds options other that `enum` and `required`, since tests for those are already built in.

If you would like to see some good examples, just look inside the folder `src/types`.

### Adding the custom type

Adding the custom type is very easy, just add it to the `validators` map in the static class. The `key` should be the identifier that the user will put in the `type` prop in the schema.
If you are not familiar with `Map`s in JavaScript, it's pretty easy to understand, [here is the MDN documentation for it](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

Here is an example of adding a custom type:

```js
// This should be the path to the custom type object we created.
const customTypeObject = require("./customType.js");
const Schema = require("schema-validator");

Schema.validators.set("customType", customTypeObject);

// Now the user can use the type by typing:
const schema = new Schema({
  username: {
    type: "customType",
  },
});

// Or even the short way
const schema = new Schema({
  username: "customType",
});
```

## Handling errors.

When the validation fails, a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) will be returned, in which the `key` will be the name of the property that had an error, and the `value` will be the error message.

An example:

```js
const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
});

schema.validate({
  age: ["This is not a number"],
});
```

The code above will throw a map:

```
Map(2) {
	"name" => "The field is required",
	"age" => "The field is not of the correct type"
}
```

## Add metadata that will be ignored by the `Schema` constructor.

Sometimes it is necessary to add metadata to the schema, for example, to use the schema declaration in other parts of our codebase, like passing it to a helper that creates forms.

There is a global type option called "meta", it is valid on all types, even custom ones, and is reserved just for that.

Code example:

```js
const schema = new Schema({
  name: {
    type: String,
    required: true,
    meta: {
      placeholder: "Please enter your full name...",
      className: "form-control",
    },
  },
});
```
