jest.mock('calendar')

const calendar = require('calendar')
const _ = require('./utils')
const data = require('./data')

calendar.toChinaMonth.mockImplementation(index => index + '')
calendar.monthDays.mockReturnValue(1)
calendar.toChinaDay.mockReturnValue('初一')
calendar.lunar2solar.mockReturnValue({
  lYear: 2019,
  lMonth: 1,
  lDay: 18,
})

// 农历 2019-01-18
test('lunar calendar 2019-01-18 render', () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: '2019-01-18',
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

  expect(calendar.lunar2solar)
    .toHaveBeenCalledTimes(1)
  expect(calendar.lunar2solar)
    .toHaveBeenCalledWith(2019, 1, 18)

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
    .toEqual([118, 0, 17])
})
