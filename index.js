function cssKebab(v) {
  v = v.replace(/[\W_]+/g, '-');
  v = v.replace(/\-*([A-Z]([a-z]|$))/g, '-$1').toLowerCase();
  if (v[0] === '-') v = v.slice(1);
  if (v[v.length - 1] === '-') v = v.slice(0, v.length - 1);
  if (v === 'cssfloat') return 'float';
  return v;
}

function cssCamel(v) {
  v = cssKebab(v);
  if (v === 'float') return 'cssFloat';
  v = v
    .split('-')
    .map((v, k) => (!k ? v : v[0].toUpperCase() + v.slice(1)))
    .join('');
  return v;
}

/**
 * Function for checking and validating css properties
 * @param {string} property - css property
 * @param {boolean} [isCamelCase] - camelcased return
 * @param {boolean} [isStrictMode] - return 'false' if property not isset
 */
function cssProp(
  property,
  isCamelCase = cssProp.isCamelCase,
  isStrictMode = cssProp.isStrict
) {
  if (!property || typeof property !== 'string') {
    return isStrictMode ? false : property;
  }

  property = property.trim();
  let camel, kebab, isset;

  if (property in cssProp._CACHE) {
    [camel, kebab, isset] = cssProp._CACHE[property];
  } else {
    isset = true;
    kebab = cssKebab(property);
    if (kebab.indexOf('-')) {
      kebab = kebab
        .split('-')
        .filter((v, k) => {
          if (k || !cssProp.PREFIXES_LIST.some((prefix) => v === prefix)) {
            return v;
          }
          return '';
        })
        .join('-');
    }

    camel = cssCamel(kebab);
    if (cssProp.PROPERTIES && !(camel in cssProp.PROPERTIES)) {
      isset = false;
      cssProp._PREFIXES.some((prefix) => {
        const camelPrefixed = cssCamel(prefix + '-' + kebab);
        if (camelPrefixed in cssProp.PROPERTIES) {
          (camel = camelPrefixed), (kebab = '-' + cssKebab(camelPrefixed));
          isset = true;
        }
        return isset;
      });
    }

    cssProp._CACHE[property] = [camel, kebab, isset];
  }

  if (isStrictMode && !isset) return false;
  return isCamelCase ? camel : kebab;
}
cssProp.isCamelCase = false;
cssProp.isStrictMode = false;

cssProp._PREFIXES = '';
cssProp.PREFIXES_LIST = [];
cssProp._CACHE = {};
cssProp.PROPERTIES = {};

cssProp.setPrefixes = function setPrefixes(...args) {
  cssProp.PREFIXES_LIST = []
    .concat(...args, cssProp._PREFIXES)
    .filter((v, k, a) => a.indexOf(v) === k);

  return cssProp.PREFIXES_LIST;
};

(() => {
  cssProp._PREFIXES = [];
  cssProp.PROPERTIES = null;

  if (typeof window !== 'undefined') {
    cssProp.PROPERTIES = {};

    const _prefixes = {};
    const _list = window.getComputedStyle(window.document.body);
    // because this is a non-standard object
    /*eslint-disable guard-for-in*/
    for (const key in _list) {
      const property = `${key}` === `${+key}` ? _list[key] : key;
      cssProp.PROPERTIES[cssCamel(property)] = 1;
      if (property[0] === '-') _prefixes[property.split('-')[1]] = 1;
    }
    /*eslint-enable guard-for-in*/
    cssProp._PREFIXES = Object.keys(_prefixes);
  }

  cssProp.setPrefixes(['webkit', 'moz', 'ms', 'o']);
})();

module.exports = cssProp;
