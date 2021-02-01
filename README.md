# css-property-normalize

Function for checking and validating css properties

## Installation

```bash
yarn add css-property-normalize # npm i css-property-normalize
```

## Usage

### Basic usage:

#### `cssPropertyNormalize(property: string, toCamelCase?: boolean): string`

```js
import cssPropertyNormalize from 'css-property-normalize'
// Usage in webkit-browser:
console.log(cssPropertyNormalize('perspective-origin-y'))
console.log(cssPropertyNormalize('perspectiveOriginY'))
console.log(cssPropertyNormalize('ms-Perspective --- origin-Y'))
/* RETURN: */
;('-webkit-perspective-origin-y') // in webkit browsers
/* RETURN IN NODEJS: */
;('perspective-origin-y')

console.log(cssPropertyNormalize('--Custom  modify')) // --custom-modify

console.log(cssPropertyNormalize('user-modify'))
/* RETURN: */
;('-webkit-user-modify') // in webkit browsers
/* RETURN: */
;('-moz-user-modify') // in firefox browsers

/* camelCase */
console.log(cssPropertyNormalize('user-modify', true))
/* RETURN: */
;('webkitUserModify')
```

## License

MIT
