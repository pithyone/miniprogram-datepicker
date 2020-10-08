const calendar = require('calendar')
const lib = require('../../components/lib').default

Component({
  data: {
    value: {},
    showWeek: true,
    calendars: ['公历', '农历'],
    calendarIndex: 0,
    valueOfString: '',
  },
  observers: {
    'value.**': function (value) {
      this.setData({
        valueOfString: this.valueOfString(value),
      })
    },
    'value.isLunarCalendar': function (isLunarCalendar) {
      this.setData({
        calendarIndex: isLunarCalendar ? 1 : 0,
      })
    },
  },
  methods: {
    onReady() {
      this.setData({
        value: lib.getDefaultValue(),
      })
    },
    bindCalendarChange(e) {
      const oldCalendarIndex = parseInt(this.data.calendarIndex)
      const newCalendarIndex = parseInt(e.detail.value)
      const {year, month, day, isLeapMonth} = this.data.value

      // 公历->农历
      if (oldCalendarIndex === 0 && newCalendarIndex === 1) {
        this.setData({
          value: this.lunarCalendarToValue(calendar.solar2lunar(year, month, day)),
        })
      }

      // 农历->公历
      if (oldCalendarIndex === 1 && newCalendarIndex === 0) {
        this.setData({
          value: this.solarCalendarToValue(calendar.lunar2solar(year, month, day, isLeapMonth)),
        })
      }
    },
    bindCompChange(e) {
      this.setData({
        value: e.detail.value,
      })
    },
    bindShowWeekChange(e) {
      this.setData({
        showWeek: e.detail.value,
      })
    },
    lunarCalendarToValue(calendar) {
      const {lYear: year, lMonth: month, lDay: day, isLeap: isLeapMonth} = calendar

      return {
        year,
        month,
        day,
        isLeapMonth,
        isLunarCalendar: true,
      }
    },
    solarCalendarToValue(calendar) {
      const {cYear: year, cMonth: month, cDay: day} = calendar

      return {
        year,
        month,
        day,
        isLeapMonth: false,
        isLunarCalendar: false,
      }
    },
    valueOfString(value) {
      const {year, month, day} = value

      if (value.isLunarCalendar) {
        const {gzYear, IMonthCn, IDayCn, lYear} = calendar.lunar2solar(
          year,
          month,
          day,
          value.isLeapMonth,
        )

        return `${gzYear}(${lYear}) ${IMonthCn} ${IDayCn}`
      } else {
        const {ncWeek} = calendar.solar2lunar(year, month, day)

        return `${year}-${month}-${day} ${ncWeek}`
      }
    },
  },
})
