[![Build Status](https://travis-ci.org/samuelgozi/schema-validator.svg?branch=master)](https://travis-ci.org/samuelgozi/schema-validator)
[![codecov](https://codecov.io/gh/samuelgozi/schema-validator/branch/master/graph/badge.svg)](https://codecov.io/gh/samuelgozi/schema-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# schema-validator

As the name suggest this library helps you validate javascript objects agains a schema.
The goal of the project was to create a lightweight, performant and extensible library with no dependencies.
Currently the size of the library, compressed and gzipped(without bundling) is: **1.25KB**

## Installation

I stil haven't decided on a name, so an NPM package doesn't exist,
if you would like to install it you should use the github link as shown below.
And if you have an idea for a name, feel free to open an issue.

```
npm install https://github.com/samuelgozi/schema-validator
```

or if (like me) you use Yarn:

```
yarn add https://github.com/samuelgozi/schema-validator
```

## Roadmap

- [x] ~~100% Test coverage~~
- [x] ~~Refactor the whole tests structure, and add tests nested objects/arrays.~~
- [x] ~~Export an API for adding custom types.~~
- [ ] Add documentation and guidelines for contributors.
- [ ] Transpile everything with babel and add a sizes to the Readme.
- [x] ~~Configure CI/CD.~~
- [ ] Make a nice logo.
- [ ] Move the documentation into the GitHub Wiki.

## How to use

Lets start with an example:

```js
const schema = new Schema({
  name: String,
  age: Number,
  familyMembers: [String],
  address: {
    city: String,
    street: String
  }
});
```

Lets break it down.
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
    address: "Hertzel!!!"
  }
});
```

If the passed object adheres to the schema, then the method will not throw an error.

### What happens the validation fails?

When an object fails to validate, the `validate` method will throw an error with a message explaining exactly how the validation failed, and what property caused the error.

Lets show an example with the schema above:

```js
schema.validate({
  /* ... */
  address: {
    city: 42
  }
  /* ... */
});
```

In this object, everything is valid except `object.address.city`, so the `validate` method will throw:
`The property "address.city" is not of the correct type`

### Adding additional constrains for a field

Up until now we have seen how to set up a field with only the "Type" constrain,
But what happens when we want to add additional constrains? Well, its very simple,
instead of using the "short" syntax we used before, we are going to use the "verbose" one.
But dont worry! its still easy!

So, lets say we want to make a field be required, here is how we do that:

```js
const schema = new Schema({
  name: {
    type: String,
    required: true
  }
});
```

As you can see, its pretty straight forward.
Instead of using the "short" field syntax, we use the "verbose" one, which means
that instead of writing `name: String`, we provide an object that has a `type` property, and any additional options
that the type we want to use supports, in this example we added `required`.

### What happens if I make a mistake?

Don't worry, one of the main goals of this library is to provide helpful error messages.
Lets see an example. Lets provide an invalid option to the field of type "String" and see what happens.

```js
const schema = new Schema({
  name: {
    type: String,
    banana: "banana?"
  }
});
```

In the example above, the `name` prop contains an invalid configuration option `banana`,
Running this code will throw the error: `Unknown property "banana"`.

## Short vs verbose syntax

There are two ways of specifing a "Field schema". One is short and easier to read, and the second one is "verbose" and is used when we want additional constrains on that field. like `required`, `enum` etc.

Here is an example of how we would use the "short" syntax to create a field that should be of type `String`:

```js
const schema = new Schema({
  name: String
});
```

As you can see its pretty easy to read, and pretty self explanatory.

The verbose version of the same "Field schema" would be:

```js
const schema = new Schema({
  name: {
    type: String
  }
});
```

The validation will work exactly the same for both syntaxes. In fact, behnid the scenes, the short version
will be converted into the verbose one. So its practically the same.

With the `Object` and `Array` types the short and verbose version will look like this:
**Array**

```js
// Short
const schema = new Schema({
  favoriteMovies: [String]
});

// Verbose
const schema = new Schema({
  favoriteMovies: {
    type: Array,
    child: [
      {
        type: String
      }
    ]
  }
});
```

**Object**

```js
// Short
const schema = new Schema({
  address: {
    city: String,
    street: String
  }
});

// Verbose
const schema = new Schema({
  address: {
    type: Object,
    child: {
      city: {
        type: String
      },
      street: {
        type: String
      }
    }
  }
});
```

As you can see in the later examples, the differance is significant. But the verbose syntax is needed because sometimes we need to add constrains to the fields.

## What types are supported?

The built in types are: `String`, `Number`, `Boolean`, `Date`, `Array` and `Object`.

Each type has additional options, this is not a final list, and more will be added in the near future.

**`String`**

- `required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
  An empty string counts an empty, and will throw.
- `enum` - Array. Should be an array of strings that are allowed. Any other string will throw an error at validation.
  All the enum options must of the correct type or an error will be thrown on schema creation.
- `test` - RegExp. When specified, the string must match the regular expression in order to pass validation.

**`Number`**

- `required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
- `enum` - Array. Should be an array of strings that are allowed. Any other string will throw an error at validation.
  All the enum options must of the correct type or an error will be thrown on schema creation.

**`Boolean`.**

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.

**`Date`**
A valid date is any date that javascript can parse and result in a valid date object.

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.

**`Array`**

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
- `child` - Array. An array of schema fields that can be included in the array. So if a value matches any of them it is allowed. Buif the schema doesn't match any of the provided field schemas then the validator will throw with an error specifing exactly which index threw.

**`Object`**

- `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
  Please note that currently an empty object will pass validation.
- `child` - A sub scehma object (Like the one passed to the `new Schema()` constructor).

### Creating a custom type

A type is just an object with some methods that the schema class will invoke when needed.
Here is a simplified example of how it would look(explanation below).

```js
const customType = {
  allowedProps: ["required", "enum", "etc"],

  validateType(value, schema) {
    /* ... */
  },

  validateSchema(schema) {
    /* ...  */
  }
};
```

Yep, its that simple. Each property has a specific role. Here is an explanation of what each of them does.

- `allowedProps` - An array that lists all the allowed properties in the type schema, excluding 'type', because its always required(we add it for you).
- `validateType` - This method is the one that should contain the logic to allow or reject a value. It should return a Boolean, `true` if the value matches and `false` otherwise.
  The method will receive the value itself, and the schema options for the field.
- `validateSchema` - This method is invoked when a schema class is instantiated, and it is used to check that the schema was written correctly and doesn't contain any invalid props or typos.

Please note that only`validateType` and `allowedProps` props are required, your type does not need to support `required` or `enum`, and shouldn't have a `validateSchema` method unless it adds options other that `enum` and `required`, since tests for those are already built in.

If you would like to see some good examples, just look inside the folder `src/types`.

### Adding the custom type

Adding the custom type is very easy, just add it to the `validators` map in the static class. The `key` should be the identifier that the user will put in the `type` prop in the schema.
If you are not familiar with `Map`s in Javascript, its pretty easy to understand, [here is the MDN documentation for it](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

Here is an example of adding a custom type:

```js
// This should be the path to the custom type object we created.
const customTypeObject = require("./customType.js");
const Schema = require("schema-validator");

Schema.validators.set("customType", customTypeObject);

// Now the user can use the type by typing:
const schema = new Schema({
  username: {
    type: "customType"
  }
});

// Or even the short way
const schema = new Schema({
  username: "customType"
});
```

## Can I contribute?

Yes, feel free to help. I tried to document the code as much as possible, and make it as clean as possible, and it is very easy to extend with additional types.

And if you have an issue or a feature request, just open an issue, I'll usually respond pretty fast.
