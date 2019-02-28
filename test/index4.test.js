jest.mock('calendar')

const calendar = require('calendar')
const _ = require('./utils')
const data = require('./data')

calendar.toChinaMonth.mockImplementation(index => index + '')
calendar.monthDays.mockReturnValue(1)
calendar.toChinaDay.mockReturnValue('初一')
calendar.solar2lunar.mockReturnValue({
  cYear: 2019,
  cMonth: 2,
  cDay: 25,
  lYear: 2019,
  lMonth: 1,
  lDay: 21,
})

// 农历 2019-01-21
test('lunar calendar 2019-01-21 render', () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: '',
    chinese: true,
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
    .toHaveBeenNthCalledWith(2, 2019, 2, 25)

  expect(calendar.monthDays)
    .toHaveBeenCalledTimes(1)
  expect(calendar.monthDays)
    .toHaveBeenCalledWith(2019, 1)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(1)
  expect(calendar.toChinaDay)
    .toHaveBeenCalledWith(1)

  expect(component.data.multiArray)
    .toEqual([data.years, data.chinaMonths, ['初一']])

  expect(component.data.multiIndex)
    .toEqual([118, 0, 20])
})
