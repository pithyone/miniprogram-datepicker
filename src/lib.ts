import calendar, {Calendar} from 'calendar'
import findIndex from 'lodash.findindex'

export interface DateObject {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  isLunarCalendar: boolean;
}

export interface ColumnItem {
  label: string;
  value: number;
}

export interface MonthColumnItem extends ColumnItem {
  isLeap: boolean;
}

type Column = ColumnItem[]
type MonthColumn = MonthColumnItem[]

export type ObjectMultiArray = [Column, MonthColumn, Column]
export type MultiIndex = [number, number, number]

const YEAR_START = 1900
const YEAR_END = 2100

const MONTH_START = 1
const MONTH_END = 12

const DAY_START = 1

export default {
  getToday(): Calendar {
    return calendar.solar2lunar()
  },
  validateValue(value: any): DateObject {
    const year = parseInt(value?.year, 10)
    const month = parseInt(value?.month, 10)
    const day = parseInt(value?.day, 10)
    const isLeapMonth = !!value?.isLeapMonth
    const isLunarCalendar = !!value?.isLunarCalendar

    const validated = isLunarCalendar
      ? calendar.lunar2solar(year, month, day, isLeapMonth)
      : calendar.solar2lunar(year, month, day)

    const date = validated === -1 ? this.getToday() : validated

    return {
      year: isLunarCalendar ? date.lYear : date.cYear,
      month: isLunarCalendar ? date.lMonth : date.cMonth,
      day: isLunarCalendar ? date.lDay : date.cDay,
      isLeapMonth: isLunarCalendar ? date.isLeap : false,
      isLunarCalendar,
    }
  },
  getDefaultValue(): DateObject {
    const today = new Date()

    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      isLeapMonth: false,
      isLunarCalendar: false,
    }
  },
  getDefaultObjectMultiArray(): ObjectMultiArray {
    return [
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
    ]
  },
  getColumn<T>(start: number, end: number, callback: (i: number) => T): T[] {
    const ret = []

    for (let i = start; i <= end; i++) {
      ret.push(callback.call(this, i))
    }

    return ret
  },
  getColumnItem<T>(column: T[], index: number): T {
    if (column[index] === undefined) {
      index = column.length - 1
    }

    return column[index]
  },
  getYearColumnItem(year: number): ColumnItem {
    return {
      label: `${year}年`,
      value: year,
    }
  },
  getYearColumn(): Column {
    return this.getColumn(YEAR_START, YEAR_END, this.getYearColumnItem)
  },
  getYearIndex(year: number): number {
    return year - YEAR_START
  },
  getMonthColumnItemLabel(month: number, isLeapMonth: boolean, isLunarCalendar: boolean): string {
    if (isLunarCalendar) {
      let chinaMonth = calendar.toChinaMonth(month) as string // 调用前校验过参数，忽略错误的情况

      if (isLeapMonth) {
        chinaMonth = `闰${chinaMonth}`
      }

      return chinaMonth
    }

    return `${month}月`
  },
  getMonthColumnItem(month: number, isLeapMonth: boolean, isLunarCalendar: boolean): MonthColumnItem {
    return {
      label: this.getMonthColumnItemLabel(month, isLeapMonth, isLunarCalendar),
      value: month,
      isLeap: isLeapMonth,
    }
  },
  getSolarMonthColumnItem(month: number): MonthColumnItem {
    return this.getMonthColumnItem(month, false, false)
  },
  getLunarNotLeapMonthColumnItem(month: number): MonthColumnItem {
    return this.getMonthColumnItem(month, false, true)
  },
  getLunarLeapMonthColumnItem(month: number): MonthColumnItem {
    return this.getMonthColumnItem(month, true, true)
  },
  getSolarMonthColumn(): MonthColumn {
    return this.getColumn(MONTH_START, MONTH_END, this.getSolarMonthColumnItem)
  },
  getLunarMonthColumn(year: number): MonthColumn {
    const column = this.getColumn(MONTH_START, MONTH_END, this.getLunarNotLeapMonthColumnItem)

    const leapMonth = calendar.leapMonth(year)

    if (leapMonth !== 0) {
      column.splice(leapMonth, 0, this.getLunarLeapMonthColumnItem(leapMonth))
    }

    return column
  },
  getMonthColumn(year: number, isLunarCalendar: boolean): MonthColumn {
    return isLunarCalendar ? this.getLunarMonthColumn(year) : this.getSolarMonthColumn()
  },
  getMonthIndex(monthColumn: MonthColumn, month: number, isLeapMonth: boolean): number {
    return findIndex(monthColumn, {
      value: month,
      isLeap: isLeapMonth,
    })
  },
  getDayColumnItemLabel(year: number, month: number, day: number, isLeapMonth: boolean, isLunarCalendar: boolean, isShowWeek: boolean): string {
    let label = isLunarCalendar ? calendar.toChinaDay(day) : `${day}日`

    if (isShowWeek) {
      const {ncWeek} = (isLunarCalendar
        ? calendar.lunar2solar(year, month, day, isLeapMonth)
        : calendar.solar2lunar(year, month, day)) as Calendar // 调用前校验过参数，忽略错误的情况

      label = `${label} ${ncWeek}`
    }

    return label
  },
  getDayColumnItem(year: number, month: number, day: number, isLeapMonth: boolean, isLunarCalendar: boolean, isShowWeek: boolean): ColumnItem {
    const label = this.getDayColumnItemLabel(
      year,
      month,
      day,
      isLeapMonth,
      isLunarCalendar,
      isShowWeek,
    )

    return {
      label,
      value: day,
    }
  },
  getSolarDayColumnItem(year: number, month: number, day: number, isShowWeek: boolean): ColumnItem {
    return this.getDayColumnItem(
      year, month, day, false, false, isShowWeek,
    )
  },
  getLunarDayColumnItem(year: number, month: number, day: number, isLeapMonth: boolean, isShowWeek: boolean): ColumnItem {
    return this.getDayColumnItem(
      year, month, day, isLeapMonth, true, isShowWeek,
    )
  },
  getSolarDays(year: number, month: number): number {
    return calendar.solarDays(year, month)
  },
  getLunarDays(year: number, month: number, isLeapMonth: boolean): number {
    return isLeapMonth ? calendar.leapDays(year) : calendar.monthDays(year, month)
  },
  getSolarDayColumn(year: number, month: number, isShowWeek: boolean): Column {
    return this.getColumn(
      DAY_START,
      this.getSolarDays(year, month),
      (day) => this.getSolarDayColumnItem(year, month, day, isShowWeek),
    )
  },
  getLunarDayColumn(year: number, month: number, isLeapMonth: boolean, isShowWeek: boolean): Column {
    return this.getColumn(
      DAY_START,
      this.getLunarDays(year, month, isLeapMonth),
      (day) => this.getLunarDayColumnItem(
        year, month, day, isLeapMonth, isShowWeek,
      ),
    )
  },
  getDayColumn(year: number, month: number, isLeapMonth: boolean, isLunarCalendar: boolean, isShowWeek: boolean): Column {
    return isLunarCalendar
      ? this.getLunarDayColumn(year, month, isLeapMonth, isShowWeek)
      : this.getSolarDayColumn(year, month, isShowWeek)
  },
  getDayIndex(day: number): number {
    return day - DAY_START
  },
}
