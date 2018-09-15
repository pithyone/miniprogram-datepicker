const _ = require('./utils')

let componentId
let component

beforeAll(async () => {
  componentId = await _.load('index', 'comp')
})

test('render', async () => {
  component = _.render(componentId)

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  expect(_.match(component.dom, '<wx-picker class="picker-class"></wx-picker>'))
    .toBe(true)
})

test('render-with-slot', async () => {
  component = _.render(await _.load({
    template: '<comp><view>123</view></comp>',
    usingComponents: {
      comp: componentId,
    },
  }))

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  expect(_.match(component.dom, '<comp><wx-picker class="picker-class"><wx-view>123</wx-view></wx-picker></comp>'))
    .toBe(true)
})

test.each([
  ['2016-09-01', true, [115, 8, 0]],
  ['2016-09-01', false, [115, 8, 0]],
])('value=%s&chinese=%s', async (a, b, expected) => {
  component = _.render(componentId, {
    value: a,
    chinese: b,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  expect(component.data.multiIndex)
    .toEqual(expected)
})
