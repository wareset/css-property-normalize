export const cssPropertyNormalize = ((): {
  (property: string, toCamelCase?: boolean): string
} => {
  const test = (regexp: RegExp, value: any): boolean => regexp.test(value)
  const replace = (s: string, r: RegExp, p: any = ''): string => s.replace(r, p)
  const toLowerCase = (s: string): string => s.toLowerCase()
  const slice = (s: string, n1: number, n2?: number): string => s.slice(n1, n2)
  const split = (s: string, r: RegExp): string[] => s.split(r)

  const PREFIXES = ['webkit', 'moz', 'ms', 'o']

  const REG_CHECK = /^(?:--|-(?:webkit|moz|ms|o)-)?[a-z\d]+(?:-[a-z\d]+)*$/,
    REG_2 = /.*?(\w+|--?|$).*/,
    REG_3 = /.*?(\w+|$).*/

  const DASH = '-'
  const DOUBLE_DASH = DASH + DASH

  const prefixy = (v: string): string =>
    test(/^(webkit|moz|ms|o)-/, v) ? DASH + v : v
  const lowerty = (prop: string, tmp?: string[]): string =>
    (!test(REG_CHECK, prop) &&
      (tmp = split(replace(prop, /((?<!\w)\w|[^a-z\d]+)/g, '|$1'), /[^-a-z\d]/i)
        .filter((v) => v)
        .map((v, k) => toLowerCase(replace(v, !k ? REG_2 : REG_3, '$1')))
        .filter((v) => v)) &&
      prefixy((tmp[0][0] === DASH ? tmp.shift() : '') + tmp.join(DASH))) ||
    prop

  const PROPERTY_LIST: any = {}
  ;((): any => {
    try {
      const COMPUTEDS = window.getComputedStyle(window.document.body)
      /* eslint-disable guard-for-in */
      for (const key in COMPUTEDS) {
        PROPERTY_LIST[lowerty(test(/\d/, key[0]) ? COMPUTEDS[key] : key)] = 1
      }
      /* eslint-enable guard-for-in */
    } catch (e) {
      /**/
    }
  })()

  const CACHE: any = {}
  const resDefault = (prop: string): string =>
    CACHE[prop] ||
    (CACHE[prop] =
      ((prop = lowerty(prop)) &&
        (prop in PROPERTY_LIST || prop[0] + prop[1] === DOUBLE_DASH) &&
        prop) ||
      ((prop = replace(prop, /^-\w+-/, '')) &&
        PREFIXES.some(
          (v, _: any) =>
            (_ = DASH + v + DASH + prop) in PROPERTY_LIST && (prop = _)
        ) &&
        prop) ||
      prop)

  const CACHE_CAMELCASE: any = {}
  const camelly = (prop: string): string =>
    (prop = split(prop, /[^a-z\d]/i)
      .map((v) => v && v[0].toUpperCase() + toLowerCase(slice(v, 1)))
      .join('')) && toLowerCase(prop[0]) + slice(prop, 1)

  const resCamelly = (prop: string): string =>
    CACHE_CAMELCASE[prop] || (CACHE_CAMELCASE[prop] = camelly(resDefault(prop)))

  return (prop: string, toCamelCase = false): string =>
    toCamelCase ? resCamelly(prop) : resDefault(prop)
})()

export default cssPropertyNormalize
