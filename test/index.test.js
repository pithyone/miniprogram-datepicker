const _ = require('./utils')

beforeEach(() => {
  jest.resetModules()
  jest.restoreAllMocks()
})

test('._render({foo: \'bar\'}, true)', async () => {
  const lib = require('../miniprogram_dist/lib').default

  const validateValue = jest.spyOn(lib, 'validateValue')
    .mockReturnValue({
      year: 2020,
      month: 9,
      day: 17,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  const getYearColumn = jest.spyOn(lib, 'getYearColumn')
    .mockReturnValue([{foo: 'year'}])

  const getMonthColumn = jest.spyOn(lib, 'getMonthColumn')
    .mockReturnValue([{foo: 'month'}])

  const getDayColumn = jest.spyOn(lib, 'getDayColumn')
    .mockReturnValue([{foo: 'day'}])

  const getYearIndex = jest.spyOn(lib, 'getYearIndex')
    .mockReturnValue(0)

  const getMonthIndex = jest.spyOn(lib, 'getMonthIndex')
    .mockReturnValue(1)

  const getDayIndex = jest.spyOn(lib, 'getDayIndex')
    .mockReturnValue(2)

  const componentId = _.load('index', 'comp')
  const component = _.render(componentId)
  const that = component.instance

  that._render({foo: 'bar'}, true)

  expect(validateValue)
    .toHaveBeenCalledTimes(1)

  expect(validateValue)
    .toHaveBeenCalledWith({foo: 'bar'})

  expect(validateValue)
    .toHaveReturnedWith({
      year: 2020,
      month: 9,
      day: 17,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  expect(getYearColumn)
    .toHaveBeenCalledTimes(1)

  expect(getYearColumn)
    .toHaveReturnedWith([{foo: 'year'}])

  expect(getMonthColumn)
    .toHaveBeenCalledTimes(1)

  expect(getMonthColumn)
    .toHaveBeenCalledWith(2020, false)

  expect(getMonthColumn)
    .toHaveReturnedWith([{foo: 'month'}])

  expect(getDayColumn)
    .toHaveBeenCalledTimes(1)

  expect(getDayColumn)
    .toHaveBeenCalledWith(2020, 9, false, false, true)

  expect(getDayColumn)
    .toHaveReturnedWith([{foo: 'day'}])

  expect(that.data.isRendered)
    .toBe(true)

  expect(that.data.isLunarCalendar)
    .toBe(false)

  expect(that.data.objectMultiArray)
    .toEqual([[{foo: 'year'}], [{foo: 'month'}], [{foo: 'day'}]])

  expect(that.data.multiIndex)
    .toEqual([0, 0, 0])

  await _.sleep(100)

  expect(getYearIndex)
    .toHaveBeenCalledTimes(1)

  expect(getYearIndex)
    .toHaveBeenCalledWith(2020)

  expect(getYearIndex)
    .toHaveReturnedWith(0)

  expect(getMonthIndex)
    .toHaveBeenCalledTimes(1)

  expect(getMonthIndex)
    .toHaveBeenCalledWith([{foo: 'month'}], 9, false)

  expect(getMonthIndex)
    .toHaveReturnedWith(1)

  expect(getDayIndex)
    .toHaveBeenCalledTimes(1)

  expect(getDayIndex)
    .toHaveBeenCalledWith(17)

  expect(getDayIndex)
    .toHaveReturnedWith(2)

  expect(that.data.multiIndex)
    .toEqual([0, 1, 2])
})

test.each([true, false])('._triggerRender() with this.data.showWeek=%p', async (showWeek) => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {showWeek})
  const that = component.instance

  that._triggerRender()

  expect(that.data.showWeek)
    .toBe(showWeek)
})

test.each([{
  detail: {
    column: 1,
    value: 2,
  },
}])('.bindColumnChange(%p)', async (e) => {
  const lib = require('../miniprogram_dist/lib').default

  const getYearColumn = jest.spyOn(lib, 'getYearColumn')
    .mockReturnValue([{foo: 'year'}])

  const getColumnItem = jest.spyOn(lib, 'getColumnItem')
    .mockReturnValueOnce({value: 2020})
    .mockReturnValueOnce({
      value: 9,
      isLeap: false,
    })
    .mockReturnValueOnce({value: 17})

  const getMonthColumn = jest.spyOn(lib, 'getMonthColumn')
    .mockReturnValue([{foo: 'month'}])

  const getDayColumn = jest.spyOn(lib, 'getDayColumn')
    .mockReturnValue([{foo: 'day'}])

  const componentId = _.load('index', 'comp')
  const component = _.render(componentId)
  const that = component.instance

  const _render = jest.spyOn(that, '_render')
    .mockImplementation(jest.fn())

  component.setData({
    showWeek: true,
    isLunarCalendar: false,
    multiIndex: [0, 1, 2],
  })

  that.bindColumnChange(e)

  expect(that.data.multiIndex)
    .toEqual([0, 2, 2])

  expect(getYearColumn)
    .toHaveBeenCalledTimes(1)

  expect(getYearColumn)
    .toHaveReturnedWith([{foo: 'year'}])

  expect(getColumnItem)
    .toHaveBeenCalledTimes(3)

  expect(getColumnItem)
    .toHaveBeenNthCalledWith(1, [{foo: 'year'}], 0)

  expect(getColumnItem)
    .toHaveBeenNthCalledWith(2, [{foo: 'month'}], 2)

  expect(getColumnItem)
    .toHaveBeenNthCalledWith(3, [{foo: 'day'}], 2)

  expect(getColumnItem)
    .toHaveNthReturnedWith(1, {value: 2020})

  expect(getColumnItem)
    .toHaveNthReturnedWith(2, {
      value: 9,
      isLeap: false,
    })

  expect(getColumnItem)
    .toHaveNthReturnedWith(3, {value: 17})

  expect(getMonthColumn)
    .toHaveBeenCalledTimes(1)

  expect(getMonthColumn)
    .toHaveBeenCalledWith(2020, false)

  expect(getMonthColumn)
    .toHaveReturnedWith([{foo: 'month'}])

  expect(getDayColumn)
    .toHaveBeenCalledTimes(1)

  expect(getDayColumn)
    .toHaveBeenCalledWith(2020, 9, false, false, true)

  expect(getDayColumn)
    .toHaveReturnedWith([{foo: 'day'}])

  expect(_render)
    .toHaveBeenCalledTimes(2)

  expect(_render)
    .toHaveBeenCalledWith({
      year: 2020,
      month: 9,
      day: 17,
      isLeapMonth: false,
      isLunarCalendar: false,
    }, true)
})

test('.bindCancel()', async () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId)
  const that = component.instance

  const _triggerRender = jest.spyOn(that, '_triggerRender')
    .mockImplementation(jest.fn())

  that.bindCancel()

  expect(_triggerRender)
    .toHaveBeenCalledTimes(1)
})

test('.bindChange()', async () => {
  const lib = require('../miniprogram_dist/lib').default

  const getColumnItem = jest.spyOn(lib, 'getColumnItem')
    .mockReturnValueOnce({value: 2020})
    .mockReturnValueOnce({
      value: 9,
      isLeap: false,
    })
    .mockReturnValueOnce({value: 17})

  const componentId = _.load('index', 'comp')
  const component = _.render(componentId)
  const that = component.instance

  const triggerEvent = jest.spyOn(that, 'triggerEvent')
    .mockImplementation(jest.fn())

  component.setData({
    objectMultiArray: [[{foo: 'year'}], [{foo: 'month'}], [{foo: 'day'}]],
    multiIndex: [0, 1, 2],
    isLunarCalendar: false,
  })

  that.bindChange()

  expect(getColumnItem)
    .toHaveBeenCalledTimes(3)

  expect(getColumnItem)
    .toHaveBeenNthCalledWith(1, [{foo: 'year'}], 0)

  expect(getColumnItem)
    .toHaveBeenNthCalledWith(2, [{foo: 'month'}], 1)

  expect(getColumnItem)
    .toHaveBeenNthCalledWith(3, [{foo: 'day'}], 2)

  expect(getColumnItem)
    .toHaveNthReturnedWith(1, {value: 2020})

  expect(getColumnItem)
    .toHaveNthReturnedWith(2, {
      value: 9,
      isLeap: false,
    })

  expect(getColumnItem)
    .toHaveNthReturnedWith(3, {value: 17})

  expect(triggerEvent)
    .toHaveBeenCalledTimes(1)

  expect(triggerEvent)
    .toHaveBeenCalledWith('change', {
      value: {
        year: 2020,
        month: 9,
        day: 17,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
    })
})

function getLabel({objectMultiArray, multiIndex, isLunarCalendar}) {
  const [yearColumn, monthColumn, dayColumn] = objectMultiArray
  const [yearIndex, monthIndex, dayIndex] = multiIndex

  return (isLunarCalendar ? '农历' : '公历') + ' ' + yearColumn[yearIndex].label + monthColumn[monthIndex].label + dayColumn[dayIndex].label
}

test.each([
  [
    {},
    '公历 2020年9月18日 星期五',
    false,
  ],
  [
    {
      showWeek: true,
    },
    '公历 2020年9月18日 星期五',
    false,
  ],
  [
    {
      showWeek: false,
    },
    '公历 2020年9月18日',
    false,
  ],
  [
    {
      value: {
        year: 2020,
        month: 9,
        day: 17,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
    },
    '公历 2020年9月17日 星期四',
    false,
  ],
  [
    {
      value: {
        year: 2020,
        month: 9,
        day: 16,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
      showWeek: true,
    },
    '公历 2020年9月16日 星期三',
    false,
  ],
  [
    {
      value: {
        year: 2020,
        month: 9,
        day: 15,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
      showWeek: false,
    },
    '公历 2020年9月15日',
    false,
  ],
  [
    {
      value: {
        year: 2020,
        month: 8,
        day: 2,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
    },
    '农历 2020年八月初二 星期五',
    false,
  ],
  [
    {
      value: {
        year: 2020,
        month: 8,
        day: 1,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
      showWeek: true,
    },
    '农历 2020年八月初一 星期四',
    false,
  ],
  [
    {
      value: {
        year: 2020,
        month: 4,
        day: 1,
        isLeapMonth: true,
        isLunarCalendar: true,
      },
    },
    '农历 2020年闰四月初一 星期六',
    false,
  ],
  [
    {
      value: {
        year: 2017,
        month: 6,
        day: 1,
        isLeapMonth: true,
        isLunarCalendar: true,
      },
      showWeek: true,
    },
    '农历 2017年闰六月初一 星期日',
  ],
  [
    {
      value: {
        year: 2023,
        month: 2,
        day: 1,
        isLeapMonth: true,
        isLunarCalendar: true,
      },
      showWeek: false,
    },
    '农历 2023年闰二月初一',
  ],
  [
    {
      value: {
        year: 1900,
        month: 1,
        day: 1,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
    },
    '公历 2020年9月15日 星期二',
  ],
  [
    {
      value: {
        year: 1900,
        month: 1,
        day: 1,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
      showWeek: true,
    },
    '公历 2020年9月15日 星期二',
  ],
  [
    {
      value: {
        year: 1900,
        month: 1,
        day: 1,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
      showWeek: false,
    },
    '公历 2020年9月15日',
  ],
  [
    {
      value: {
        year: 2020,
        month: 7,
        day: 30,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
    },
    '农历 2020年七月廿八 星期二',
  ],
  [
    {
      value: {
        year: 2020,
        month: 7,
        day: 30,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
      showWeek: true,
    },
    '农历 2020年七月廿八 星期二',
  ],
  [
    {
      value: {
        year: 2020,
        month: 7,
        day: 30,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
      showWeek: false,
    },
    '农历 2020年七月廿八',
  ],
  [
    {
      value: {
        year: 2020,
        month: 4,
        day: 30,
        isLeapMonth: true,
        isLunarCalendar: true,
      },
    },
    '农历 2020年七月廿八 星期二',
  ],
  [
    {
      value: {
        year: 2020,
        month: 4,
        day: 30,
        isLeapMonth: true,
        isLunarCalendar: true,
      },
      showWeek: true,
    },
    '农历 2020年七月廿八 星期二',
  ],
  [
    {
      value: {
        year: 2020,
        month: 4,
        day: 30,
        isLeapMonth: true,
        isLunarCalendar: true,
      },
      showWeek: false,
    },
    '农历 2020年七月廿八',
  ],
])('render with properties %p', async (properties, expected) => {
  const lib = require('../miniprogram_dist/lib').default

  jest.spyOn(lib, 'getDefaultValue')
    .mockReturnValue({
      year: 2020,
      month: 9,
      day: 18,
      isLeapMonth: false,
      isLunarCalendar: false,
    })

  jest.spyOn(lib, 'getToday')
    .mockReturnValue({
      cDay: 15,
      cMonth: 9,
      cYear: 2020,
      isLeap: false,
      lDay: 28,
      lMonth: 7,
      lYear: 2020,
    })

  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, properties)

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  await _.sleep(100)

  const that = component.instance

  expect(getLabel(that.data))
    .toBe(expected)
})

test.each([
  [
    {
      value: {
        year: 2020,
        month: 7,
        day: 28,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
      showWeek: true,
    },
    '农历 2020年七月廿八 星期二',
    '公历 2020年7月28日 星期二',
    '农历 2020年七月廿八 星期二',
    '农历 2020年七月廿八',
    '农历 2020年七月廿八 星期二',
  ],
  [
    {
      value: {
        year: 2020,
        month: 2,
        day: 30,
        isLeapMonth: false,
        isLunarCalendar: true,
      },
      showWeek: true,
    },
    '农历 2020年二月三十 星期一',
    '公历 2020年3月1日 星期日',
    '农历 2020年二月三十 星期一',
    '农历 2020年二月三十',
    '农历 2020年二月三十 星期一',
  ],
  [
    {
      value: {
        year: 2020,
        month: 9,
        day: 15,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
      showWeek: true,
    },
    '公历 2020年9月15日 星期二',
    '农历 2020年九月十五 星期六',
    '公历 2020年9月15日 星期二',
    '公历 2020年9月15日',
    '公历 2020年9月15日 星期二',
  ],
  [
    {
      value: {
        year: 2020,
        month: 9,
        day: 30,
        isLeapMonth: false,
        isLunarCalendar: false,
      },
      showWeek: true,
    },
    '公历 2020年9月30日 星期三',
    '农历 2020年七月廿八 星期二',
    '公历 2020年9月30日 星期三',
    '公历 2020年9月30日',
    '公历 2020年9月30日 星期三',
  ],
])('render with properties %p and change value.isLunarCalendar|showWeek', async (properties, expected1, expected2, expected3, expected4, expected5) => {
  const lib = require('../miniprogram_dist/lib').default

  jest.spyOn(lib, 'getToday')
    .mockReturnValue({
      isLeap: false,
      lDay: 28,
      lMonth: 7,
      lYear: 2020,
    })

  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, properties)

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  await _.sleep(100)

  const that = component.instance

  expect(getLabel(that.data))
    .toBe(expected1)

  // 模拟切换历法
  that.setData({
    value: Object.assign(that.data.value, {
      isLunarCalendar: !that.data.value.isLunarCalendar,
    }),
  })

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe(expected2)

  // 模拟切换历法
  that.setData({
    value: Object.assign(that.data.value, {
      isLunarCalendar: !that.data.value.isLunarCalendar,
    }),
  })

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe(expected3)

  // 模拟切换显示星期
  that.setData({
    showWeek: false,
  })

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe(expected4)

  // 模拟切换显示星期
  that.setData({
    showWeek: true,
  })

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe(expected5)
})

test('change year column event', async () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: {
      year: 2020,
      month: 12,
      day: 1,
      isLeapMonth: false,
      isLunarCalendar: true,
    },
    showWeek: true,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  await _.sleep(100)

  const that = component.instance

  expect(that.data.objectMultiArray[1].length)
    .toBe(13)

  expect(getLabel(that.data))
    .toBe('农历 2020年腊月初一 星期三')

  // 模拟滚动年到2021
  that.bindColumnChange({
    detail: {
      column: 0,
      value: 121,
    },
  })

  await _.sleep(100)

  expect(that.data.objectMultiArray[1].length)
    .toBe(12)

  expect(getLabel(that.data))
    .toBe('农历 2021年腊月初一 星期一')
})

test('change month column event', async () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: {
      year: 2020,
      month: 1,
      day: 31,
      isLeapMonth: false,
      isLunarCalendar: false,
    },
    showWeek: true,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  await _.sleep(100)

  const that = component.instance

  expect(getLabel(that.data))
    .toBe('公历 2020年1月31日 星期五')

  // 模拟滚动月到2
  that.bindColumnChange({
    detail: {
      column: 1,
      value: 1,
    },
  })

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe('公历 2020年2月29日 星期六')
})

test('cancel event', async () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: {
      year: 2020,
      month: 9,
      day: 18,
      isLeapMonth: false,
      isLunarCalendar: false,
    },
    showWeek: true,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  await _.sleep(100)

  const that = component.instance

  expect(getLabel(that.data))
    .toBe('公历 2020年9月18日 星期五')

  // 模拟滚动年到2019
  that.bindColumnChange({
    detail: {
      column: 0,
      value: 119,
    },
  })

  // 模拟滚动月到10
  that.bindColumnChange({
    detail: {
      column: 1,
      value: 9,
    },
  })

  // 模拟滚动日到17
  that.bindColumnChange({
    detail: {
      column: 2,
      value: 16,
    },
  })

  expect(getLabel(that.data))
    .toBe('公历 2019年10月17日 星期四')

  // 模拟点击取消
  that.bindCancel()

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe('公历 2020年9月18日 星期五')
})

test('change event', async () => {
  const componentId = _.load('index', 'comp')
  const component = _.render(componentId, {
    value: {
      year: 2020,
      month: 9,
      day: 18,
      isLeapMonth: false,
      isLunarCalendar: false,
    },
    showWeek: true,
  })

  const parent = document.createElement('parent-wrapper')
  component.attach(parent)

  await _.sleep(100)

  const that = component.instance

  expect(getLabel(that.data))
    .toBe('公历 2020年9月18日 星期五')

  // 模拟滚动年到2019
  that.bindColumnChange({
    detail: {
      column: 0,
      value: 119,
    },
  })

  // 模拟滚动月到10
  that.bindColumnChange({
    detail: {
      column: 1,
      value: 9,
    },
  })

  // 模拟滚动日到17
  that.bindColumnChange({
    detail: {
      column: 2,
      value: 16,
    },
  })

  expect(getLabel(that.data))
    .toBe('公历 2019年10月17日 星期四')

  // 模拟点击确定
  that.bindChange()

  await _.sleep(100)

  expect(getLabel(that.data))
    .toBe('公历 2019年10月17日 星期四')
})
