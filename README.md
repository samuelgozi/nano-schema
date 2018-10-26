# schema-validator
As the name suggest this small library helps you validate javascript objects agains a schema.
The goal of the project was to create a lightweight, performant and extensible library with no dependencies.

## Installation
I stil haven't decided on a name, so an NPM package doesn't exist,
if you would like to install it you should use the github link as shown below.
```
npm install https://github.com/samuelgozi/schema-validator
```
or if (like me) you use Yarn:
```
yarn add https://github.com/samuelgozi/schema-validator
```

## Roadmap
- [ ] Make more thorough tests with more "extreme" test cases.
- [ ] Export an API for adding custom types.
- [ ] Add documentation and guidelines for contributors.
- [ ] Transpile everithing with babel and add a sizes to the Readme.
- [ ] Configure CI/CD.

## How to use
Lets start with an example:
```js
const schema = new Schema({
  name: String,
  age: Number,
  familyMembers: [String],
  address: {
    city: String,
    street: String,
  }
});
```
Lets break it down.
The schema we created above will put the next constrains in place:
 * `object.name` - Can only be a String
 * `object.age` - Can only be a Number
 * `object.familiyMembers` - Can only be an Array, and its list items can only be Strings
 * `object.address` - Can only be an Object, and its only allowed props are `city` and `street` and both on them must be strings.
In this example, there are no other requirements, non of the fields is required or has azny additional restrictions.

### Now, how do I test my object?
Its very simple, in order to verify that an object passes all the constrains we just use the `validate` method:
```js
schema.validate({
  name: 'Samuel',
  age: '23',
  familyMembers: ['brother name', 'sister name', 'etc'],
  address: {
    city: 'Tel-Aviv',
    address: 'Hertzel!!!'
  }
});
```
Currently if the object matches the schema, then it will "not throw",
This will be changed in near future to returning a `true` or an array of errors.

### What happens when it doesn't match?
When an object doesn't match a schema, an error message that tells us exactly which property caused
it will be thrown.
Lets show an example with the schema above.
```js
schema.validate({
  /* ... */

  address: {
    city: 42,

    /* ... */
  }
});
```
In this object, everithing is valid except `object.address.city`, so the validation will throw:
```The property "address.city" is not of the correct type```

### Adding additional constrains to a field
Up until now we have seen how to declare a simple "Type" with no additional constrains,
But what happens when we want to add additional constrains? Well, its very simple,
instead of using the "short" syntax we used above, we are going to use the "verbose" one.
But dont worry! its still easy!

So, lets say we want to make a field be required, heres is how we do that:
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
that the type we want to use supports, in this example it was `required`.

### What happens if I make a mistake?
Dont worry, one of the main goals of this library is to provide helpful error messages.
Lets see an example. Lets provide an invalid property to the "String" type and see what happens.
```js
const schema = new Schema({
  name: {
    type: String,
    banana: 'banana?'
  }
});
```
In the example above, the `name` prop contains an unsupported/invalid configuration option `banana`,
Running this code will throw the error: `Unknown property "banana"`.

## Short vs verbose syntax
There are two ways of specifing a "Field schema". One is short and easier to read, and the second one is "verbose" and is used when we want to add additional options to the field. like `required`, `enum` etc.

Here is an example of how we would use the "short" syntax to create a field that should be of type `String`:
```
const schema = new Schema({
  name: String
});
```
As you can see its pretty easy to read, and pretty self explanatory.

The verbose version of the same "Field schema" would be:
```
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
// Verbose
const schema = new Schema({
  favoriteMovies: {
    type: Array,
    child: [{
      type: String
    }]
  }
});

// Short
const schema = new Schema({
  favoriteMovies: [String]
});
```

**Object**
```js
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

// Short
const schema = new Schema({
  address: {
    city: String,
    street: String
  }
});
```

As you can see in the later examples, the differance is significant. But the verbose syntax is needed because sometimes we need to add options to the fields.


## What types are supported?
The built in types are: `String`, `Number`, `Boolean`, `Date`, `Array` and `Object`.

Each type has additional options, this is not a final list, and more will be added in the near future.
**`String`**
 * `required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
 An empty string counts an empty, and will throw.
 * `enum` - Array. Should be an array of strings that are allowed. Any other string will throw an error at validation.
 All the enum options must of the correct type or an error will be thrown on schema creation.

**`Number`**
 * `required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
 * `enum` - Array. Should be an array of strings that are allowed. Any other string will throw an error at validation.
 All the enum options must of the correct type or an error will be thrown on schema creation.

**`Boolean`.**
 * `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.

**`Date`**
A valid date is any date that javascript can parse and result in a valid date object.
 * `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.

**`Array`**
 * `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
 * `child` - Array. An array of schema fields that can be included in the array. So if a value matches any of them it is allowed. Buif the schema doesn't match any of the provided field schemas then the validator will throw with an error specifing exactly which index threw.

**`Object`**
 * `Required` - Boolean. If set to true, the field cannot be left empty, or else an error will be thrown on validation.
 Please note that currently an empty object will pass validation.
 * `child` - A sub scehma object (Like the one passed to the `new Schema()` constructor).
 
## Can I contribute?
Yes, feel free to help. I tried to document the code as much as possible, and make it as clean as possible, and it is very easy to extend with additional types.

And if you have an issue or a feature request, just open an issue, I'll usually respond pretty fast.
