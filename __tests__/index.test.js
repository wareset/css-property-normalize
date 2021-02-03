const css = require('../dist').default

test('enumChars:', () => {
  expect(css()).toBe('')
  expect(css('')).toBe('')
  expect(css(null)).toBe('')
  expect(css([])).toBe('')
  expect(css([234])).toBe('234')

  expect(css({})).toBe('object-object')
  expect(css({}, true)).toBe('objectObject')

  expect(css('user modify')).toBe('-webkit-user-modify')
  expect(css('ms user modify')).toBe('-webkit-user-modify')
  expect(css('-ms userModify')).toBe('-webkit-user-modify')
  expect(css('user modify', true)).toBe('webkitUserModify')

  expect(css('-user modify')).toBe('modify')
  expect(css('--user modify')).toBe('--user-modify')
  expect(css('--user modify', true)).toBe('userModify')
})
