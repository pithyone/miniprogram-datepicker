jest.mock('calendar')

const calendar = require('calendar')
const _ = require('./utils')
const data = require('./data')

let component
let that

calendar.toChinaMonth.mockImplementation(index => index + '')
calendar.solarDays.mockReturnValue(1)
calendar.monthDays.mockReturnValue(1)
calendar.toChinaDay.mockReturnValue('初一')
calendar.lunar2solar.mockReturnValue({
  lYear: 2019,
  lMonth: 2,
  lDay: 25,
})
calendar.solar2lunar
  .mockReturnValueOnce({
    cYear: 2019,
    cMonth: 2,
    cDay: 22,
    ncWeek: '星期五',
  })
  .mockReturnValueOnce({
    cYear: 2019,
    cMonth: 2,
    cDay: 25,
    ncWeek: '星期一',
  })
  .mockReturnValueOnce({
    cYear: 2019,
    cMonth: 2,
    cDay: 25,
    ncWeek: '星期一',
  })
  .mockReturnValueOnce({
    cYear: 2020,
    cMonth: 2,
    cDay: 25,
    ncWeek: '星期二',
  })
  .mockReturnValueOnce({
    cYear: 2020,
    cMonth: 3,
    cDay: 25,
    ncWeek: '星期三',
  })
  .mockReturnValueOnce({
    cYear: 2020,
    cMonth: 3,
    cDay: 26,
    ncWeek: '星期四',
  })
  .mockReturnValueOnce({
    cYear: 2019,
    cMonth: 2,
    cDay: 25,
    ncWeek: '星期一',
  })

// value: '2019-02-22' chinese: false
test('solar calendar 2019-02-22 render', () => {
  const componentId = _.load('index', 'comp')
  component = _.render(componentId, {
    value: '2019-02-22',
    chinese: false,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  that = component.instance

  expect(_.match(component.dom, '<wx-picker></wx-picker>'))
    .toBe(true)

  expect(calendar.toChinaMonth)
    .toHaveBeenCalledTimes(12)
  expect(calendar.toChinaMonth)
    .toHaveBeenLastCalledWith(12)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(1)
  expect(calendar.solar2lunar)
    .toHaveBeenCalledWith(2019, 2, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(1)
  expect(calendar.solarDays)
    .toHaveBeenCalledWith(2019, 2)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期五']])

  expect(component.data.multiIndex)
    .toEqual([118, 1, 21])
})

// value: '2019-02-25' chinese: false
test('value observer', () => {
  component.setData({
    value: '2019-02-25',
  })

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(2)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(2, 2019, 2, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(2)
  expect(calendar.solarDays)
    .toHaveBeenNthCalledWith(2, 2019, 2)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期一']])

  expect(component.data.multiIndex)
    .toEqual([118, 1, 24])
})

// value: '2019-02-25' chinese: true
test('chinese observer', () => {
  component.setData({
    chinese: true,
  })

  expect(calendar.lunar2solar)
    .toHaveBeenCalledTimes(1)
  expect(calendar.lunar2solar)
    .toHaveBeenCalledWith(2019, 2, 25)

  expect(calendar.monthDays)
    .toHaveBeenCalledTimes(1)
  expect(calendar.monthDays)
    .toHaveBeenCalledWith(2019, 2)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(1)
  expect(calendar.toChinaDay)
    .toHaveBeenCalledWith(1)

  expect(component.data.multiArray)
    .toEqual([data.years, data.chinaMonths, ['初一']])

  expect(component.data.multiIndex)
    .toEqual([118, 1, 24])
})

// value: '2019-02-26' chinese: true
test('change event', () => {
  that._bindMultiPickerChange({detail: {value: [118, 1, 25]}})

  expect(component.data.multiIndex)
    .toEqual([118, 1, 25])
})

// value: '2020-02-26' chinese: true
test('columnchange event', () => {
  that._bindMultiPickerColumnChange({
    detail: {
      column: 0,
      value: 119,
    },
  })

  expect(calendar.monthDays)
    .toHaveBeenCalledTimes(2)
  expect(calendar.monthDays)
    .toHaveBeenNthCalledWith(2, 2020, 2)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(2)
  expect(calendar.toChinaDay)
    .toHaveBeenNthCalledWith(2, 1)

  expect(component.data.multiArray)
    .toEqual([data.years, data.chinaMonths, ['初一']])

  expect(component.data.multiIndex)
    .toEqual([119, 1, 25])
})

// value: '2020-03-26' chinese: true
test('columnchange event', () => {
  that._bindMultiPickerColumnChange({
    detail: {
      column: 1,
      value: 2,
    },
  })

  expect(calendar.monthDays)
    .toHaveBeenCalledTimes(3)
  expect(calendar.monthDays)
    .toHaveBeenNthCalledWith(3, 2020, 3)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(3)
  expect(calendar.toChinaDay)
    .toHaveBeenNthCalledWith(3, 1)

  expect(component.data.multiArray)
    .toEqual([data.years, data.chinaMonths, ['初一']])

  expect(component.data.multiIndex)
    .toEqual([119, 2, 25])
})

// value: '2020-03-27' chinese: true
test('columnchange event', () => {
  that._bindMultiPickerColumnChange({
    detail: {
      column: 2,
      value: 26,
    },
  })

  expect(calendar.monthDays)
    .toHaveBeenCalledTimes(4)
  expect(calendar.monthDays)
    .toHaveBeenNthCalledWith(4, 2020, 3)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(4)
  expect(calendar.toChinaDay)
    .toHaveBeenNthCalledWith(4, 1)

  expect(component.data.multiArray)
    .toEqual([data.years, data.chinaMonths, ['初一']])

  expect(component.data.multiIndex)
    .toEqual([119, 2, 26])
})

// value: '2020-02-25' chinese: false
test('columnchange event', () => {
  component.setData({
    chinese: false,
  })

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(3)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(3, 2019, 2, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(3)
  expect(calendar.solarDays)
    .toHaveBeenNthCalledWith(3, 2019, 2)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期一']])

  expect(component.data.multiIndex)
    .toEqual([118, 1, 24])

  that._bindMultiPickerColumnChange({
    detail: {
      column: 0,
      value: 119,
    },
  })

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(4)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(4, 2020, 2, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(4)
  expect(calendar.solarDays)
    .toHaveBeenNthCalledWith(4, 2020, 2)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期二']])

  expect(component.data.multiIndex)
    .toEqual([119, 1, 24])
})

// value: '2020-03-25' chinese: false
test('columnchange event', () => {
  that._bindMultiPickerColumnChange({
    detail: {
      column: 1,
      value: 2,
    },
  })

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(5)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(5, 2020, 3, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(5)
  expect(calendar.solarDays)
    .toHaveBeenNthCalledWith(5, 2020, 3)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期三']])

  expect(component.data.multiIndex)
    .toEqual([119, 2, 24])
})

// value: '2020-03-26' chinese: false
test('columnchange event', () => {
  that._bindMultiPickerColumnChange({
    detail: {
      column: 2,
      value: 25,
    },
  })

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(6)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(6, 2020, 3, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(6)
  expect(calendar.solarDays)
    .toHaveBeenNthCalledWith(6, 2020, 3)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期四']])

  expect(component.data.multiIndex)
    .toEqual([119, 2, 25])
})

// value: '2019-02-25' chinese: false
test('cancel event', () => {
  that._bindMultiPickerCancel()

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(7)
  expect(calendar.solar2lunar)
    .toHaveBeenNthCalledWith(7, 2019, 2, 1)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(7)
  expect(calendar.solarDays)
    .toHaveBeenNthCalledWith(7, 2019, 2)

  expect(component.data.multiArray)
    .toEqual([data.years, data.months, ['1日 星期一']])

  expect(component.data.multiIndex)
    .toEqual([118, 1, 24])
})
