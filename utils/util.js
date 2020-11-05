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


const getDate = function(days) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  //
  let year = date.getFullYear();
  let mnoth = formatNumber(date.getMonth() + 1);
  let day = formatNumber(date.getDate());
  return year + "-" + mnoth + '-' + day;
}

module.exports = {
  formatTime: formatTime,
  getDate: getDate
}
