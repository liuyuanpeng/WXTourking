// 获取对应年份月份的天数
export const getMonthDay = (year, month) => {
  var d = new Date(year, month, 0);
  return d.getDate();
};

// 获取月份天数
export const getDayList = (year, month) => {
  const dayList = [];
  var d = new Date(year, month, 0);
  for (let i = 1; i <= d.getDate(); i++) {
      dayList.push(i + "日");
  }

  return dayList;
};

// 获取最近的年、月、日、时、分的集合
export const getPickerViewList = (hidePassed) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const yearList = [];
  const monthList = [];
  // const dayList = getDayList(year, month);
  const dayList = [];
  const hourList = [];
  const minuteList = [];

  const dayListValue = []

  const WeekArr = ["日","一","二","三","四","五","六"];

  for (let i = 1970; i <= 2070; i++) {
      yearList.push(i + "年");
  }
  for (let i = 1; i <= 12; i++) {
    monthList.push(i + "月");
  }

  let bShow = !hidePassed
  for (let i = year - 1; i <= year + 1; i++) {
    for(let j = 1; j <= 12; j++) {
      const monthDays = getMonthDay(i, j)
      for (let k = 1; k <= monthDays; k++) {
        let newDate = new Date(i, j-1, k)
        let weekDay = WeekArr[newDate.getDay()]
        if (year === i && month === j && day === k) {
          dayList.push('今天')
          bShow = true
        } else {
          bShow && dayList.push(`${j}月${k}日 周${weekDay}`)
        }
        
        bShow && dayListValue.push({year: i, month: j, day: k})
      }
    }
  }

  for (let i = 0; i <= 23; i++) {
      hourList.push(i);
  }
  for (let i = 0; i <= 59; i++) {
      minuteList.push(i);
  }
  return { dayListValue, dayList, hourList, minuteList };
};
