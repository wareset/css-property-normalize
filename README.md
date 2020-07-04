# css-property-normalize

Function for checking and validating css properties

## Installation

```bash
npm i css-property-normalize
```

or

```bash
yarn add css-property-normalize
```

## Usage

### Require or Import:

```js
const cssProp = require('css-property-normalize');
// or
import cssProp from 'css-property-normalize';
```

### Basic usage:

#### `cssProp(property: String, [isCamelCase: Boolean = cssProp.isCamelCase = false], [isStrictMode: Boolean = cssProp.isStrictMode = false])`

```js
// Usage in webkit-browser:
console.log(cssProp('perspective-origin-y'));
console.log(cssProp('perspectiveOriginY'));
console.log(cssProp('--ms-Perspective --- origin-Y'));
/* RETURN: */ ('-webkit-perspective-origin-y'); // in webkit browsers
/* RETURN IN NODEJS: */ ('perspective-origin-y');

/* Use isCamelCase */
console.log(cssProp('user-drag', true));
/* RETURN: */ ('webkitUserDrag'); // in webkit browsers
/* RETURN: */ ('userDrag'); // in mozilla browsers

/* Use isStrictMode */
console.log(cssProp('not-isset-property', true, false));
/* RETURN: */ ('notIssetProperty');
console.log(cssProp('not-isset-property', true, true));
/* RETURN: */ false; // because this property not isset in 'cssProp.PROPERTIES'
```

### Additional settings:

```js
cssProp.isCamelCase = false; // Default value 'isCamelCase' for cssProp
cssProp.isStrictMode = false; // Default value 'isStrictMode' for cssProp

// set automatically. No need to change it
cssProp._PREFIXES = ['webkit']; // in webkit-browsers
cssProp._PREFIXES = ['moz', 'webkit']; // in firefox
// etc...

//list of all css properties
console.log(cssProp.PROPERTIES);
/* RETURN: */ {
  alignContent: 1;
  alignItems: 1;
  alignSelf: 1;
  alignmentBaseline: 1;
  all: 1;
  animation: 1;
  // etc...
}

// list of all possible prefixes
console.log(cssProp.PREFIXES_LIST);
/* RETURN: */ ['webkit', 'moz', 'ms', 'o']; // by default
```

### Change default prefixes:

Default prefixes: ['webkit', 'moz', 'ms', 'o']. But you can change them:

```js
// Usage in webkit-browser:
cssProp.setPrefixes(['ms', 'customprefix']); // without prefix 'webkit'
// or cssProp.setPrefixes('ms', 'customprefix');
// cssProp.PREFIXES_LIST = ['ms', 'customprefix', 'webkit']; // in webkit

console.log(cssProp('customprefix-appearance'));
/* RETURN: */ ('-webkit-appearance'); // in webkit-browser
/* RETURN: */ ('-moz-appearance'); // in firefox
//but
console.log(cssProp('o-appearance'));
/* RETURN: */ ('o-appearance'); // because 'o' not isset in
```

## License

MIT
