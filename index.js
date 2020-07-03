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

// webkitUserDrag
function cssProp(val, isCamelCase = cssProp.isCamelCase, isStrictMode = cssProp.isStrict) {
  if (!val || typeof val !== 'string') return isStrictMode ? false : val;

  val = val.trim();
  let camel, kebab, isset;

  if (val in cssProp.CACHE) {
    [camel, kebab, isset] = cssProp.CACHE[val];
  } else {
    isset = true;
    kebab = cssKebab(val);
    if (kebab.indexOf('-')) {
      kebab = kebab
        .split('-')
        .filter((v, k) => {
          if (k || !cssProp.PREFIXES.some((prefix) => v === prefix)) return v;
          return '';
        })
        .join('-');
    }

    camel = cssCamel(kebab);
    if (!(camel in cssProp.PROPERTIES)) {
      const camelPrefixed = cssCamel(cssProp.PREFIX + '-' + kebab);
      if (camelPrefixed in cssProp.PROPERTIES) {
        (camel = camelPrefixed), (kebab = cssKebab(camelPrefixed));
      } else isset = false;
    }

    cssProp.CACHE[val] = [camel, kebab, isset];
  }

  if (isStrictMode && !isset) return false;
  return isCamelCase ? camel : kebab;
}
cssProp.isCamelCase = false;
cssProp.isStrictMode = false;
cssProp.PREFIX = '';
cssProp.PREFIXES = [];
cssProp.CACHE = {};
cssProp.PROPERTIES = {};

cssProp.setPrefixes = function setPrefixes(...args) {
  cssProp.PREFIX = '';
  cssProp.PREFIXES = [].concat(...args);

  cssProp.PROPERTIES = {};
  if (typeof window !== 'undefined') {
    cssProp.PROPERTIES = { ...window.document.body.style };
  }

  const regexp = new RegExp('^(' + cssProp.PREFIXES.join('|') + ')[A-Z]');
  Object.keys(cssProp.PROPERTIES).some((prop) => {
    const match = prop.match(regexp);
    return match && (cssProp.PREFIX = match[1]);
  });

  return cssProp.PREFIX;
};

(() => cssProp.setPrefixes(['webkit', 'ms', 'o']))();

module.exports = cssProp;
