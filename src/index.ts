import lib, {DateObject, MultiIndex, ObjectMultiArray} from './lib'

type ColumnChangeEvent = {
  detail: {
    column: 0 | 1 | 2
    value: number
  }
}

type TData = {
  isRendered: boolean
  isLunarCalendar: boolean
  objectMultiArray: ObjectMultiArray
  multiIndex: MultiIndex
}

type TProperty = {
  value: {
    type: typeof Object
    value: DateObject
  };
  showWeek: {
    type: typeof Boolean
    value: boolean
  };
}

type TMethod = {
  _render: (value: any, isShowWeek: boolean) => void
  _triggerRender: () => void
  bindColumnChange: (e: ColumnChangeEvent) => void
  bindCancel: () => void
  bindChange: () => void
}

Component<TData, TProperty, TMethod>({
  options: {
    pureDataPattern: /^value|showWeek|isRendered|isLunarCalendar/,
  },
  properties: {
    value: {
      type: Object,
      value: lib.getDefaultValue(),
    },
    showWeek: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    isRendered: false,
    isLunarCalendar: false,
    objectMultiArray: lib.getDefaultObjectMultiArray(),
    multiIndex: [0, 0, 0],
  },
  observers: {
    'value, showWeek': function (value: any, isShowWeek: boolean): void {
      this._render && this._render(value, isShowWeek)
    },
  },
  lifetimes: {
    attached() {
      if (this.data.isRendered === false) {
        this._triggerRender()
      }
    },
  },
  methods: {
    _render(value, isShowWeek) {
      const {
        year, month, day, isLeapMonth, isLunarCalendar,
      } = lib.validateValue(value)

      const yearColumn = lib.getYearColumn()
      const monthColumn = lib.getMonthColumn(year, isLunarCalendar)
      const dayColumn = lib.getDayColumn(year, month, isLeapMonth, isLunarCalendar, isShowWeek)

      this.setData({
        isRendered: true,
        isLunarCalendar,
        objectMultiArray: [yearColumn, monthColumn, dayColumn],
      })

      setTimeout(() => {
        this.setData({
          multiIndex: [
            lib.getYearIndex(year),
            lib.getMonthIndex(monthColumn, month, isLeapMonth),
            lib.getDayIndex(day),
          ],
        })
      }, 100)
    },
    _triggerRender() {
      this.setData({
        showWeek: this.data.showWeek,
      })
    },
    bindColumnChange(e) {
      const {column, value} = e.detail
      const {showWeek: isShowWeek, isLunarCalendar} = this.data

      this.setData({
        [`multiIndex[${column}]`]: value,
      })

      let [yearIndex, monthIndex, dayIndex] = this.data.multiIndex

      const yearColumn = lib.getYearColumn()
      const year = lib.getColumnItem(yearColumn, yearIndex).value

      const monthColumn = lib.getMonthColumn(year, isLunarCalendar)
      const {value: month, isLeap: isLeapMonth} = lib.getColumnItem(monthColumn, monthIndex)

      const dayColumn = lib.getDayColumn(year, month, isLeapMonth, isLunarCalendar, isShowWeek)
      const day = lib.getColumnItem(dayColumn, dayIndex).value

      this._render({
        year,
        month,
        day,
        isLeapMonth,
        isLunarCalendar,
      }, isShowWeek)
    },
    bindCancel() {
      this._triggerRender()
    },
    bindChange() {
      const {objectMultiArray, multiIndex, isLunarCalendar} = this.data
      const [yearColumn, monthColumn, dayColumn] = objectMultiArray
      const [yearIndex, monthIndex, dayIndex] = multiIndex

      const year = lib.getColumnItem(yearColumn, yearIndex).value
      const {value: month, isLeap: isLeapMonth} = lib.getColumnItem(monthColumn, monthIndex)
      const day = lib.getColumnItem(dayColumn, dayIndex).value

      const value = {
        year,
        month,
        day,
        isLeapMonth,
        isLunarCalendar,
      }

      this.triggerEvent('change', {value})
    },
  },
})
