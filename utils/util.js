const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 当前日期加参数天
const getAddDate = function(days) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  //
  let year = date.getFullYear();
  let mnoth = formatNumber(date.getMonth() + 1);
  let day = formatNumber(date.getDate());
  return year + "-" + mnoth + '-' + day;
}

// 当前日期减参数天
const getSubDate = function(days) {
  let date = new Date();
  date.setDate(date.getDate() - days);
  //
  let year = date.getFullYear();
  let mnoth = formatNumber(date.getMonth() + 1);
  let day = formatNumber(date.getDate());
  return year + "-" + mnoth + '-' + day;
}

const dateSubToDaysFun = function(startTime,endTime) {
  //日期格式化
  var start_date = new Date(startTime.replace(/-/g, "/"));
  var end_date = new Date(endTime.replace(/-/g, "/"));
  //转成毫秒数，两个日期相减
  var ms = end_date.getTime() - start_date.getTime();
  //转换成天数
  var day = parseInt(ms / (1000 * 60 * 60 * 24));
  return day;
}

module.exports = {
  formatTime: formatTime,
  getAddDate: getAddDate,
  getSubDate: getSubDate,
  dateSubToDaysFun: dateSubToDaysFun
}
