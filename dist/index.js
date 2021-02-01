'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var cssPropertyNormalize = (() => {
  var test = (regexp, value) => regexp.test(value);

  var replace = (s, r, p = '') => s.replace(r, p);

  var toLowerCase = s => s.toLowerCase();

  var slice = (s, n1, n2) => s.slice(n1, n2);

  var split = (s, r) => s.split(r);

  var PREFIXES = ['webkit', 'moz', 'ms', 'o'];
  var REG_CHECK = /^(?:--|-(?:webkit|moz|ms|o)-)?[a-z\d]+(?:-[a-z\d]+)*$/,
      REG_2 = /.*?(\w+|--?|$).*/,
      REG_3 = /.*?(\w+|$).*/;
  var DASH = '-';
  var DOUBLE_DASH = DASH + DASH;

  var prefixy = v => test(/^(webkit|moz|ms|o)-/, v) ? DASH + v : v;

  var lowerty = (prop, tmp) => !test(REG_CHECK, prop) && (tmp = split(replace(prop, /((?<!\w)\w|[^a-z\d]+)/g, '|$1'), /[^-a-z\d]/i).filter(v => v).map((v, k) => toLowerCase(replace(v, !k ? REG_2 : REG_3, '$1'))).filter(v => v)) && prefixy((tmp[0][0] === DASH ? tmp.shift() : '') + tmp.join(DASH)) || prop;

  var PROPERTY_LIST = {};

  (() => {
    try {
      var COMPUTEDS = window.getComputedStyle(window.document.body);
      /* eslint-disable guard-for-in */

      for (var key in COMPUTEDS) {
        PROPERTY_LIST[lowerty(test(/\d/, key[0]) ? COMPUTEDS[key] : key)] = 1;
      }
      /* eslint-enable guard-for-in */

    } catch (e) {
      /**/
    }
  })();

  var CACHE = {};

  var resDefault = prop => CACHE[prop] || (CACHE[prop] = (prop = lowerty(prop)) && (prop in PROPERTY_LIST || prop[0] + prop[1] === DOUBLE_DASH) && prop || (prop = replace(prop, /^-\w+-/, '')) && PREFIXES.some((v, _) => (_ = DASH + v + DASH + prop) in PROPERTY_LIST && (prop = _)) && prop || prop);

  var CACHE_CAMELCASE = {};

  var camelly = prop => (prop = split(prop, /[^a-z\d]/i).map(v => v && v[0].toUpperCase() + toLowerCase(slice(v, 1))).join('')) && toLowerCase(prop[0]) + slice(prop, 1);

  var resCamelly = prop => CACHE_CAMELCASE[prop] || (CACHE_CAMELCASE[prop] = camelly(resDefault(prop)));

  return (prop, toCamelCase = false) => toCamelCase ? resCamelly(prop) : resDefault(prop);
})();

exports.cssPropertyNormalize = cssPropertyNormalize;
exports.default = cssPropertyNormalize;
