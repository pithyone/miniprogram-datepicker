beforeEach(() => {
  jest.resetModules()
})

test('.getToday()', () => {
  const ret = {foo: 'bar'}

  jest.doMock('calendar', () => ({
    solar2lunar: jest.fn()
      .mockReturnValue(ret),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default
  const today = lib.getToday()

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.solar2lunar)
    .toHaveReturnedWith(ret)

  expect(today)
    .toBe(ret)

  jest.dontMock('calendar')
})

test.each([{
  year: 2020,
  month: 7,
  day: 28,
  isLeapMonth: false,
  isLunarCalendar: true,
}])('.validateValue(%p)', (value) => {
  jest.doMock('calendar', () => ({
    lunar2solar: jest.fn()
      .mockReturnValue({
        isLeap: false,
        lDay: 28,
        lMonth: 7,
        lYear: 2020,
      }),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default
  const validated = lib.validateValue(value)

  expect(calendar.lunar2solar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.lunar2solar)
    .toHaveBeenCalledWith(2020, 7, 28, false)

  expect(calendar.lunar2solar)
    .toHaveReturnedWith({
      isLeap: false,
      lDay: 28,
      lMonth: 7,
      lYear: 2020,
    })

  expect(validated)
    .toEqual({
      year: 2020,
      month: 7,
      day: 28,
      isLeapMonth: false,
      isLunarCalendar: true,
    })

  jest.dontMock('calendar')
})

test.each([{
  year: 2020,
  month: 9,
  day: 15,
  isLeapMonth: false,
  isLunarCalendar: false,
}])('.validateValue(%p)', (value) => {
  jest.doMock('calendar', () => ({
    solar2lunar: jest.fn()
      .mockReturnValue({
        cDay: 15,
        cMonth: 9,
        cYear: 2020,
        isLeap: false,
      }),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default
  const validated = lib.validateValue(value)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledWith(2020, 9, 15)

  expect(calendar.solar2lunar)
    .toHaveReturnedWith({
      cDay: 15,
      cMonth: 9,
      cYear: 2020,
      isLeap: false,
    })

  expect(validated)
    .toEqual({
      year: 2020,
      month: 9,
      day: 15,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  jest.dontMock('calendar')
})

test.each([{
  year: 0,
  month: 0,
  day: 0,
  isLeapMonth: true,
  isLunarCalendar: true,
}])('.validateValue(%p)', (value) => {
  jest.doMock('calendar', () => ({
    lunar2solar: jest.fn()
      .mockReturnValue(-1),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const getToday = jest.spyOn(lib, 'getToday')
    .mockReturnValue({
      isLeap: false,
      lDay: 28,
      lMonth: 7,
      lYear: 2020,
    })

  const validated = lib.validateValue(value)

  expect(calendar.lunar2solar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.lunar2solar)
    .toHaveBeenCalledWith(0, 0, 0, true)

  expect(calendar.lunar2solar)
    .toHaveReturnedWith(-1)

  expect(getToday)
    .toHaveBeenCalledTimes(1)

  expect(getToday)
    .toHaveReturnedWith({
      isLeap: false,
      lDay: 28,
      lMonth: 7,
      lYear: 2020,
    })

  expect(validated)
    .toEqual({
      year: 2020,
      month: 7,
      day: 28,
      isLeapMonth: false,
      isLunarCalendar: true,
    })

  jest.dontMock('calendar')
})

test.each([{
  year: 0,
  month: 0,
  day: 0,
  isLeapMonth: false,
  isLunarCalendar: false,
}])('.validateValue(%p)', (value) => {
  jest.doMock('calendar', () => ({
    solar2lunar: jest.fn()
      .mockReturnValue(-1),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const getToday = jest.spyOn(lib, 'getToday')
    .mockReturnValue({
      cDay: 15,
      cMonth: 9,
      cYear: 2020,
    })

  const validated = lib.validateValue(value)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledWith(0, 0, 0)

  expect(calendar.solar2lunar)
    .toHaveReturnedWith(-1)

  expect(getToday)
    .toHaveBeenCalledTimes(1)

  expect(getToday)
    .toHaveReturnedWith({
      cDay: 15,
      cMonth: 9,
      cYear: 2020,
    })

  expect(validated)
    .toEqual({
      year: 2020,
      month: 9,
      day: 15,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  jest.dontMock('calendar')
})

test('.validateValue()', () => {
  jest.doMock('calendar', () => ({
    solar2lunar: jest.fn()
      .mockReturnValue({
        cDay: 15,
        cMonth: 9,
        cYear: 2020,
      }),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default
  const validated = lib.validateValue()

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledWith(NaN, NaN, NaN)

  expect(calendar.solar2lunar)
    .toHaveReturnedWith({
      cDay: 15,
      cMonth: 9,
      cYear: 2020,
    })

  expect(validated)
    .toEqual({
      year: 2020,
      month: 9,
      day: 15,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  jest.dontMock('calendar')
})

test('.getDefaultValue()', () => {
  const date = Date.prototype

  const getFullYear = jest.spyOn(date, 'getFullYear')
    .mockReturnValue(2020)

  const getMonth = jest.spyOn(date, 'getMonth')
    .mockReturnValue(0)

  const getDate = jest.spyOn(date, 'getDate')
    .mockReturnValue(1)

  const lib = require('../miniprogram_dist/lib').default

  const defaultValue = lib.getDefaultValue()

  expect(getFullYear)
    .toHaveBeenCalledTimes(1)

  expect(getFullYear)
    .toHaveReturnedWith(2020)

  expect(getMonth)
    .toHaveBeenCalledTimes(1)

  expect(getMonth)
    .toHaveReturnedWith(0)

  expect(getDate)
    .toHaveBeenCalledTimes(1)

  expect(getDate)
    .toHaveReturnedWith(1)

  expect(defaultValue)
    .toEqual({
      year: 2020,
      month: 1,
      day: 1,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  getFullYear.mockRestore()
  getMonth.mockRestore()
  getDate.mockRestore()
})

test('.getDefaultObjectMultiArray()', () => {
  const lib = require('../miniprogram_dist/lib').default

  const defaultObjectMultiArray = lib.getDefaultObjectMultiArray()

  expect(defaultObjectMultiArray)
    .toEqual([
      [
        {
          label: '某年',
          value: 0,
        },
      ],
      [
        {
          label: '某月',
          value: 0,
          isLeap: false,
        },
      ],
      [
        {
          label: '某日',
          value: 0,
        },
      ],
    ])
})

test.each([
  [10, 11, jest.fn(i => ({foo: `bar-${i}`}))],
])('.getColumn(%p, %p, %p)', (start, end, mockCallback) => {
  const lib = require('../miniprogram_dist/lib').default

  const column = lib.getColumn(start, end, mockCallback)

  expect(mockCallback)
    .toHaveBeenCalledTimes(2)

  expect(mockCallback)
    .toHaveBeenNthCalledWith(1, 10)

  expect(mockCallback)
    .toHaveBeenNthCalledWith(2, 11)

  expect(mockCallback)
    .toHaveNthReturnedWith(1, {foo: 'bar-10'})

  expect(mockCallback)
    .toHaveNthReturnedWith(2, {foo: 'bar-11'})

  expect(column)
    .toEqual([{foo: 'bar-10'}, {foo: 'bar-11'}])
})

test.each([
  [['foo'], 0],
  [['foo'], 1],
])('.getColumnItem(%p, %p)', (column, index) => {
  const lib = require('../miniprogram_dist/lib').default

  const columnItem = lib.getColumnItem(column, index)

  expect(columnItem)
    .toBe('foo')
})

test('.getYearColumnItem(2020)', () => {
  const lib = require('../miniprogram_dist/lib').default
  const yearColumnItem = lib.getYearColumnItem(2020)

  const expected = {
    label: '2020年',
    value: 2020,
  }

  expect(yearColumnItem)
    .toEqual(expected)
})

test('.getYearColumn()', () => {
  const lib = require('../miniprogram_dist/lib').default
  const ret = [{foo: 'bar'}]
  const getYearColumnItem = jest.spyOn(lib, 'getYearColumnItem')
  const getColumn = jest.spyOn(lib, 'getColumn')
    .mockReturnValue(ret)
  const yearColumn = lib.getYearColumn()

  expect(getColumn)
    .toHaveBeenCalledTimes(1)

  expect(getColumn)
    .toHaveBeenCalledWith(1900, 2100, getYearColumnItem)

  expect(getColumn)
    .toHaveReturnedWith(ret)

  expect(yearColumn)
    .toBe(ret)

  getYearColumnItem.mockRestore()
  getColumn.mockRestore()
})

test('.getYearIndex(2020)', () => {
  const lib = require('../miniprogram_dist/lib').default

  const yearIndex = lib.getYearIndex(2020)

  expect(yearIndex)
    .toBe(120)
})

test.each([
  [4, false, false],
])('.getMonthColumnItemLabel(%p, %p, %p)', (month, isLeapMonth, isLunarCalendar) => {
  const lib = require('../miniprogram_dist/lib').default
  const monthColumnItemLabel = lib.getMonthColumnItemLabel(month, isLeapMonth, isLunarCalendar)

  expect(monthColumnItemLabel)
    .toBe('4月')
})

test.each([
  [4, false, true],
])('.getMonthColumnItemLabel(%p, %p, %p)', (month, isLeapMonth, isLunarCalendar) => {
  jest.doMock('calendar', () => ({
    toChinaMonth: jest.fn()
      .mockReturnValue('四月'),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const monthColumnItemLabel = lib.getMonthColumnItemLabel(month, isLeapMonth, isLunarCalendar)

  expect(calendar.toChinaMonth)
    .toHaveBeenCalledTimes(1)

  expect(calendar.toChinaMonth)
    .toHaveBeenCalledWith(4)

  expect(calendar.toChinaMonth)
    .toHaveReturnedWith('四月')

  expect(monthColumnItemLabel)
    .toBe('四月')

  jest.dontMock('calendar')
})

test.each([
  [4, true, true],
])('.getMonthColumnItemLabel(%p, %p, %p)', (month, isLeapMonth, isLunarCalendar) => {
  const lib = require('../miniprogram_dist/lib').default

  const monthColumnItemLabel = lib.getMonthColumnItemLabel(month, isLeapMonth, isLunarCalendar)

  expect(monthColumnItemLabel)
    .toBe('闰四月')
})

test.each([
  [4, true, true],
])('.getMonthColumnItem(%p, %p, %p)', (month, isLeapMonth, isLunarCalendar) => {
  const lib = require('../miniprogram_dist/lib').default

  const getMonthColumnItemLabel = jest.spyOn(lib, 'getMonthColumnItemLabel')
    .mockReturnValue('闰四月')

  const monthColumnItem = lib.getMonthColumnItem(month, isLeapMonth, isLunarCalendar)

  expect(getMonthColumnItemLabel)
    .toHaveBeenCalledTimes(1)

  expect(getMonthColumnItemLabel)
    .toHaveBeenCalledWith(4, true, true)

  expect(getMonthColumnItemLabel)
    .toHaveReturnedWith('闰四月')

  expect(monthColumnItem)
    .toEqual({
      label: '闰四月',
      value: 4,
      isLeap: true,
    })

  getMonthColumnItemLabel.mockRestore()
})

test('.getSolarMonthColumnItem(4)', () => {
  const lib = require('../miniprogram_dist/lib').default
  const monthColumnItem = {foo: 'bar'}
  const getMonthColumnItem = jest.spyOn(lib, 'getMonthColumnItem')
    .mockReturnValue(monthColumnItem)
  const solarMonthColumnItem = lib.getSolarMonthColumnItem(4)

  expect(getMonthColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getMonthColumnItem)
    .toHaveBeenCalledWith(4, false, false)

  expect(getMonthColumnItem)
    .toHaveReturnedWith(monthColumnItem)

  expect(solarMonthColumnItem)
    .toBe(monthColumnItem)

  getMonthColumnItem.mockRestore()
})

test('.getLunarNotLeapMonthColumnItem(4)', () => {
  const lib = require('../miniprogram_dist/lib').default
  const monthColumnItem = {foo: 'bar'}
  const getMonthColumnItem = jest.spyOn(lib, 'getMonthColumnItem')
    .mockReturnValue(monthColumnItem)
  const lunarNotLeapMonthColumnItem = lib.getLunarNotLeapMonthColumnItem(4)

  expect(getMonthColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getMonthColumnItem)
    .toHaveBeenCalledWith(4, false, true)

  expect(getMonthColumnItem)
    .toHaveReturnedWith(monthColumnItem)

  expect(lunarNotLeapMonthColumnItem)
    .toBe(monthColumnItem)

  getMonthColumnItem.mockRestore()
})

test('.getLunarLeapMonthColumnItem(4)', () => {
  const lib = require('../miniprogram_dist/lib').default
  const monthColumnItem = {foo: 'bar'}
  const getMonthColumnItem = jest.spyOn(lib, 'getMonthColumnItem')
    .mockReturnValue(monthColumnItem)
  const lunarLeapMonthColumnItem = lib.getLunarLeapMonthColumnItem(4)

  expect(getMonthColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getMonthColumnItem)
    .toHaveBeenCalledWith(4, true, true)

  expect(getMonthColumnItem)
    .toHaveReturnedWith(monthColumnItem)

  expect(lunarLeapMonthColumnItem)
    .toBe(monthColumnItem)

  getMonthColumnItem.mockRestore()
})

test('.getSolarMonthColumn()', () => {
  const lib = require('../miniprogram_dist/lib').default
  const ret = [{foo: 'bar'}]
  const getSolarMonthColumnItem = jest.spyOn(lib, 'getSolarMonthColumnItem')
  const getColumn = jest.spyOn(lib, 'getColumn')
    .mockReturnValue(ret)
  const solarMonthColumn = lib.getSolarMonthColumn()

  expect(getColumn)
    .toHaveBeenCalledTimes(1)

  expect(getColumn)
    .toHaveBeenCalledWith(1, 12, getSolarMonthColumnItem)

  expect(getColumn)
    .toHaveReturnedWith(ret)

  expect(solarMonthColumn)
    .toBe(ret)

  getSolarMonthColumnItem.mockRestore()
  getColumn.mockRestore()
})

test('.getLunarMonthColumn(2019)', () => {
  jest.doMock('calendar', () => ({
    leapMonth: jest.fn()
      .mockReturnValue(0),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const ret = [{foo: 'bar'}]
  const getLunarNotLeapMonthColumnItem = jest.spyOn(lib, 'getLunarNotLeapMonthColumnItem')
  const getColumn = jest.spyOn(lib, 'getColumn')
    .mockReturnValue(ret)
  const lunarMonthColumn = lib.getLunarMonthColumn(2019)

  expect(getColumn)
    .toHaveBeenCalledTimes(1)

  expect(getColumn)
    .toHaveBeenCalledWith(1, 12, getLunarNotLeapMonthColumnItem)

  expect(getColumn)
    .toHaveReturnedWith(ret)

  expect(calendar.leapMonth)
    .toHaveBeenCalledTimes(1)

  expect(calendar.leapMonth)
    .toHaveBeenCalledWith(2019)

  expect(calendar.leapMonth)
    .toHaveReturnedWith(0)

  expect(lunarMonthColumn)
    .toBe(ret)

  getColumn.mockRestore()
  getLunarNotLeapMonthColumnItem.mockRestore()
  jest.dontMock('calendar')
})

test('.getLunarMonthColumn(2023)', () => {
  jest.doMock('calendar', () => ({
    leapMonth: jest.fn()
      .mockReturnValue(2),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const ret = [{foo: 'bar-1'}, {foo: 'bar-2'}, {foo: 'bar-3'}]
  const getLunarNotLeapMonthColumnItem = jest.spyOn(lib, 'getLunarNotLeapMonthColumnItem')
  const getLunarLeapMonthColumnItem = jest.spyOn(lib, 'getLunarLeapMonthColumnItem')
    .mockReturnValue({foo: '闰月'})
  const getColumn = jest.spyOn(lib, 'getColumn')
    .mockReturnValue(ret)
  const lunarMonthColumn = lib.getLunarMonthColumn(2023)

  expect(getColumn)
    .toHaveBeenCalledTimes(1)

  expect(getColumn)
    .toHaveBeenCalledWith(1, 12, getLunarNotLeapMonthColumnItem)

  expect(getColumn)
    .toHaveReturnedWith(ret)

  expect(calendar.leapMonth)
    .toHaveBeenCalledTimes(1)

  expect(calendar.leapMonth)
    .toHaveBeenCalledWith(2023)

  expect(calendar.leapMonth)
    .toHaveReturnedWith(2)

  expect(getLunarLeapMonthColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getLunarLeapMonthColumnItem)
    .toHaveBeenCalledWith(2)

  expect(getLunarLeapMonthColumnItem)
    .toHaveReturnedWith({foo: '闰月'})

  expect(lunarMonthColumn)
    .toEqual([{foo: 'bar-1'}, {foo: 'bar-2'}, {foo: '闰月'}, {foo: 'bar-3'}])

  getColumn.mockRestore()
  getLunarLeapMonthColumnItem.mockRestore()
  getLunarNotLeapMonthColumnItem.mockRestore()
  jest.dontMock('calendar')
})

test('.getMonthColumn(2020, true)', () => {
  const lib = require('../miniprogram_dist/lib').default

  const ret = [{foo: 'bar'}]
  const getLunarMonthColumn = jest.spyOn(lib, 'getLunarMonthColumn')
    .mockReturnValue(ret)

  const monthColumn = lib.getMonthColumn(2020, true)

  expect(getLunarMonthColumn)
    .toHaveBeenCalledTimes(1)

  expect(getLunarMonthColumn)
    .toHaveBeenCalledWith(2020)

  expect(getLunarMonthColumn)
    .toHaveReturnedWith(ret)

  expect(monthColumn)
    .toBe(ret)

  getLunarMonthColumn.mockRestore()
})

test('.getMonthColumn(2020, false)', () => {
  const lib = require('../miniprogram_dist/lib').default

  const ret = [{foo: 'bar'}]
  const getSolarMonthColumn = jest.spyOn(lib, 'getSolarMonthColumn')
    .mockReturnValue(ret)

  const monthColumn = lib.getMonthColumn(2020, false)

  expect(getSolarMonthColumn)
    .toHaveBeenCalledTimes(1)

  expect(getSolarMonthColumn)
    .toHaveReturnedWith(ret)

  expect(monthColumn)
    .toBe(ret)

  getSolarMonthColumn.mockRestore()
})

test.each([
  [[{foo: 'bar'}], 1, false],
])('.getMonthIndex(%p, %p, %p)', (monthColumn, month, isLeapMonth) => {
  jest.doMock('lodash.findindex', () => {
    return jest.fn()
      .mockReturnValue(0)
  })

  const findIndex = require('lodash.findindex')
  const lib = require('../miniprogram_dist/lib').default

  const monthIndex = lib.getMonthIndex(monthColumn, month, isLeapMonth)

  expect(findIndex)
    .toHaveBeenCalledTimes(1)

  expect(findIndex)
    .toHaveBeenCalledWith([{foo: 'bar'}], {
      value: 1,
      isLeap: false,
    })

  expect(findIndex)
    .toHaveReturnedWith(0)

  expect(monthIndex)
    .toBe(0)
})

test.each([
  [2020, 7, 20, false, true, false],
])('.getDayColumnItemLabel(%p, %p, %p, %p, %p, %p)', (year, month, day, isLeapMonth, isLunarCalendar, isShowWeek) => {
  jest.doMock('calendar', () => ({
    toChinaDay: jest.fn()
      .mockReturnValue('二十'),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const dayColumnItemLabel = lib.getDayColumnItemLabel(year, month, day, isLeapMonth, isLunarCalendar, isShowWeek)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(1)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledWith(20)

  expect(calendar.toChinaDay)
    .toHaveReturnedWith('二十')

  expect(dayColumnItemLabel)
    .toBe('二十')

  jest.dontMock('calendar')
})

test.each([
  [2020, 9, 7, false, false, false],
])('.getDayColumnItemLabel(%p, %p, %p, %p, %p, %p)', (year, month, day, isLeapMonth, isLunarCalendar, isShowWeek) => {
  const lib = require('../miniprogram_dist/lib').default

  const dayColumnItemLabel = lib.getDayColumnItemLabel(year, month, day, isLeapMonth, isLunarCalendar, isShowWeek)

  expect(dayColumnItemLabel)
    .toBe('7日')
})

test.each([
  [2020, 7, 20, false, true, true],
])('.getDayColumnItemLabel(%p, %p, %p, %p, %p, %p)', (year, month, day, isLeapMonth, isLunarCalendar, isShowWeek) => {
  jest.doMock('calendar', () => ({
    toChinaDay: jest.fn()
      .mockReturnValue('二十'),
    lunar2solar: jest.fn()
      .mockReturnValue({ncWeek: '星期一'}),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const dayColumnItemLabel = lib.getDayColumnItemLabel(year, month, day, isLeapMonth, isLunarCalendar, isShowWeek)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledTimes(1)

  expect(calendar.toChinaDay)
    .toHaveBeenCalledWith(20)

  expect(calendar.toChinaDay)
    .toHaveReturnedWith('二十')

  expect(calendar.lunar2solar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.lunar2solar)
    .toHaveBeenCalledWith(2020, 7, 20, false)

  expect(calendar.lunar2solar)
    .toHaveReturnedWith({ncWeek: '星期一'})

  expect(dayColumnItemLabel)
    .toBe('二十 星期一')

  jest.dontMock('calendar')
})

test.each([
  [2020, 9, 8, false, false, true],
])('.getDayColumnItemLabel(%p, %p, %p, %p, %p, %p)', (year, month, day, isLeapMonth, isLunarCalendar, isShowWeek) => {
  jest.doMock('calendar', () => ({
    solar2lunar: jest.fn()
      .mockReturnValue({ncWeek: '星期二'}),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const dayColumnItemLabel = lib.getDayColumnItemLabel(year, month, day, isLeapMonth, isLunarCalendar, isShowWeek)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledTimes(1)

  expect(calendar.solar2lunar)
    .toHaveBeenCalledWith(2020, 9, 8)

  expect(calendar.solar2lunar)
    .toHaveReturnedWith({ncWeek: '星期二'})

  expect(dayColumnItemLabel)
    .toBe('8日 星期二')

  jest.dontMock('calendar')
})

test.each([
  [2020, 9, 8, false, false, true],
])('.getDayColumnItem(%p, %p, %p, %p, %p, %p)', (year, month, day, isLeapMonth, isLunarCalendar, isShowWeek) => {
  const lib = require('../miniprogram_dist/lib').default

  const getDayColumnItemLabel = jest.spyOn(lib, 'getDayColumnItemLabel')
    .mockReturnValue('8日 星期二')

  const dayColumnItem = lib.getDayColumnItem(
    year, month, day, isLeapMonth, isLunarCalendar, isShowWeek,
  )

  expect(getDayColumnItemLabel)
    .toHaveBeenCalledTimes(1)

  expect(getDayColumnItemLabel)
    .toHaveBeenCalledWith(2020, 9, 8, false, false, true)

  expect(getDayColumnItemLabel)
    .toHaveReturnedWith('8日 星期二')

  expect(dayColumnItem)
    .toEqual({
      label: '8日 星期二',
      value: 8,
    })

  getDayColumnItemLabel.mockRestore()
})

test.each([
  [2020, 9, 8, true],
])('.getSolarDayColumnItem(%p, %p, %p, %p)', (year, month, day, isShowWeek) => {
  const ret = {foo: 'bar'}
  const lib = require('../miniprogram_dist/lib').default

  const getDayColumnItem = jest.spyOn(lib, 'getDayColumnItem')
    .mockReturnValue(ret)

  const solarDayColumnItem = lib.getSolarDayColumnItem(year, month, day, isShowWeek)

  expect(getDayColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getDayColumnItem)
    .toHaveBeenCalledWith(2020, 9, 8, false, false, true)

  expect(getDayColumnItem)
    .toHaveReturnedWith(ret)

  expect(solarDayColumnItem)
    .toBe(ret)

  getDayColumnItem.mockRestore()
})

test.each([
  [2020, 7, 21, false, true],
])('.getLunarDayColumnItem(%p, %p, %p, %p, %p)', (year, month, day, isLeapMonth, isShowWeek) => {
  const ret = {foo: 'bar'}
  const lib = require('../miniprogram_dist/lib').default

  const getDayColumnItem = jest.spyOn(lib, 'getDayColumnItem')
    .mockReturnValue(ret)

  const lunarDayColumnItem = lib.getLunarDayColumnItem(year, month, day, isLeapMonth, isShowWeek)

  expect(getDayColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getDayColumnItem)
    .toHaveBeenCalledWith(2020, 7, 21, false, true, true)

  expect(getDayColumnItem)
    .toHaveReturnedWith(ret)

  expect(lunarDayColumnItem)
    .toBe(ret)

  getDayColumnItem.mockRestore()
})

test.each([
  [2020, 9],
])('.getSolarDays(%p, %p)', (year, month) => {
  jest.doMock('calendar', () => ({
    solarDays: jest.fn()
      .mockReturnValue(30),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const solarDays = lib.getSolarDays(year, month)

  expect(calendar.solarDays)
    .toHaveBeenCalledTimes(1)

  expect(calendar.solarDays)
    .toHaveBeenCalledWith(2020, 9)

  expect(calendar.solarDays)
    .toHaveReturnedWith(30)

  expect(solarDays)
    .toBe(30)

  jest.dontMock('calendar')
})

test.each([
  [2020, 4, true],
])('.getLunarDays(%p, %p, %p)', (year, month, isLeapMonth) => {
  jest.doMock('calendar', () => ({
    leapDays: jest.fn()
      .mockReturnValue(29),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const lunarDays = lib.getLunarDays(year, month, isLeapMonth)

  expect(calendar.leapDays)
    .toHaveBeenCalledTimes(1)

  expect(calendar.leapDays)
    .toHaveBeenCalledWith(2020)

  expect(calendar.leapDays)
    .toHaveReturnedWith(29)

  expect(lunarDays)
    .toBe(29)

  jest.dontMock('calendar')
})

test.each([
  [2020, 4, false],
])('.getLunarDays(%p, %p, %p)', (year, month, isLeapMonth) => {
  jest.doMock('calendar', () => ({
    monthDays: jest.fn()
      .mockReturnValue(30),
  }))

  const calendar = require('calendar')
  const lib = require('../miniprogram_dist/lib').default

  const lunarDays = lib.getLunarDays(year, month, isLeapMonth)

  expect(calendar.monthDays)
    .toHaveBeenCalledTimes(1)

  expect(calendar.monthDays)
    .toHaveBeenCalledWith(2020, 4)

  expect(calendar.monthDays)
    .toHaveReturnedWith(30)

  expect(lunarDays)
    .toBe(30)

  jest.dontMock('calendar')
})

test.each([
  [2020, 9, true],
])('.getSolarDayColumn(%p, %p, %p)', (year, month, isShowWeek) => {
  const lib = require('../miniprogram_dist/lib').default

  const getColumn = jest.spyOn(lib, 'getColumn')

  const getSolarDays = jest.spyOn(lib, 'getSolarDays')
    .mockReturnValue(1)

  const getSolarDayColumnItem = jest.spyOn(lib, 'getSolarDayColumnItem')
    .mockReturnValue({foo: 'bar'})

  const solarDayColumn = lib.getSolarDayColumn(year, month, isShowWeek)

  expect(getColumn)
    .toHaveBeenCalledTimes(1)

  expect(getColumn)
    .toHaveBeenCalledWith(1, 1, expect.any(Function))

  expect(getColumn)
    .toHaveReturnedWith([{foo: 'bar'}])

  expect(getSolarDays)
    .toHaveBeenCalledTimes(1)

  expect(getSolarDays)
    .toHaveBeenCalledWith(2020, 9)

  expect(getSolarDays)
    .toHaveReturnedWith(1)

  expect(getSolarDayColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getSolarDayColumnItem)
    .toHaveBeenCalledWith(2020, 9, 1, true)

  expect(getSolarDayColumnItem)
    .toHaveReturnedWith({foo: 'bar'})

  expect(solarDayColumn)
    .toEqual([{foo: 'bar'}])

  getColumn.mockRestore()
  getSolarDays.mockRestore()
  getSolarDayColumnItem.mockRestore()
})

test.each([
  [2020, 7, false, true],
])('.getLunarDayColumn(%p, %p, %p, %p)', (year, month, isLeapMonth, isShowWeek) => {
  const lib = require('../miniprogram_dist/lib').default

  const getColumn = jest.spyOn(lib, 'getColumn')

  const getLunarDays = jest.spyOn(lib, 'getLunarDays')
    .mockReturnValue(1)

  const getLunarDayColumnItem = jest.spyOn(lib, 'getLunarDayColumnItem')
    .mockReturnValue({foo: 'bar'})

  const lunarDayColumn = lib.getLunarDayColumn(year, month, isLeapMonth, isShowWeek)

  expect(getColumn)
    .toHaveBeenCalledTimes(1)

  expect(getColumn)
    .toHaveBeenCalledWith(1, 1, expect.any(Function))

  expect(getColumn)
    .toHaveReturnedWith([{foo: 'bar'}])

  expect(getLunarDays)
    .toHaveBeenCalledTimes(1)

  expect(getLunarDays)
    .toHaveBeenCalledWith(2020, 7, false)

  expect(getLunarDays)
    .toHaveReturnedWith(1)

  expect(getLunarDayColumnItem)
    .toHaveBeenCalledTimes(1)

  expect(getLunarDayColumnItem)
    .toHaveBeenCalledWith(2020, 7, 1, false, true)

  expect(getLunarDayColumnItem)
    .toHaveReturnedWith({foo: 'bar'})

  expect(lunarDayColumn)
    .toEqual([{foo: 'bar'}])

  getColumn.mockRestore()
  getLunarDays.mockRestore()
  getLunarDayColumnItem.mockRestore()
})

test.each([
  [2020, 4, true, true, true],
])('.getDayColumn(%p, %p, %p, %p, %p)', (year, month, isLeapMonth, isLunarCalendar, isShowWeek) => {
  const lib = require('../miniprogram_dist/lib').default

  const ret = [{foo: 'bar'}]
  const getLunarDayColumn = jest.spyOn(lib, 'getLunarDayColumn')
    .mockReturnValue(ret)

  const dayColumn = lib.getDayColumn(year, month, isLeapMonth, isLunarCalendar, isShowWeek)

  expect(getLunarDayColumn)
    .toHaveBeenCalledTimes(1)

  expect(getLunarDayColumn)
    .toHaveBeenCalledWith(2020, 4, true, true)

  expect(getLunarDayColumn)
    .toHaveReturnedWith(ret)

  expect(dayColumn)
    .toBe(ret)

  getLunarDayColumn.mockRestore()
})

test.each([
  [2020, 4, false, false, true],
])('.getDayColumn(%p, %p, %p, %p, %p)', (year, month, isLeapMonth, isLunarCalendar, isShowWeek) => {
  const lib = require('../miniprogram_dist/lib').default

  const ret = [{foo: 'bar'}]
  const getSolarDayColumn = jest.spyOn(lib, 'getSolarDayColumn')
    .mockReturnValue(ret)

  const dayColumn = lib.getDayColumn(year, month, isLeapMonth, isLunarCalendar, isShowWeek)

  expect(getSolarDayColumn)
    .toHaveBeenCalledTimes(1)

  expect(getSolarDayColumn)
    .toHaveBeenCalledWith(2020, 4, true)

  expect(getSolarDayColumn)
    .toHaveReturnedWith(ret)

  expect(dayColumn)
    .toBe(ret)

  getSolarDayColumn.mockRestore()
})

test('.getDayIndex(1)', () => {
  const lib = require('../miniprogram_dist/lib').default

  const dayIndex = lib.getDayIndex(1)

  expect(dayIndex)
    .toBe(0)
})
