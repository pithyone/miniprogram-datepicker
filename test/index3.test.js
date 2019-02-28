jest.mock('calendar')

const calendar = require('calendar')
const _ = require('./utils')
const data = require('./data')

calendar.toChinaMonth.mockImplementation(index => index + '')
calendar.solarDays.mockReturnValue(1)
calendar.solar2lunar.mockReturnValue({
  cYear: 2019,
  cMonth: 2,
  cDay: 25,
  ncWeek: '星期一',
})

// 公历 2019-02-25
test('solar calendar 2019-02-25 render', () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: '',
    chinese: false,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  expect(_.match(component.dom, '<wx-picker></wx-picker>'))
    .toBe(true)

  expect(calendar.toChinaMonth)
    .toHaveBeenCalledTimes(12)
  expect(calendar.toChinaMonth)
    .toHaveBeenLastCalledWith(12)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(2)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(1)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(2, 2019, 2, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(1)
  expect(calendar.solarDays)
    .toHaveBeenCalledWith(2019, 2)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期一']])

  expect(component.data.multiIndex)
    .toEqual([118, 1, 24])
})
