/**
 * 根据秒数计算倒计时信息
 * @param duration {String|Number} 持续时间S
 * @return {{day: number, hour: number, minute: number, second: number}}
 */
export function getCountdown (duration) {
  let s = +duration
  let _day = 24 * 60 * 60
  let _hour = 60 * 60
  let _minute = 60
  let day = Math.floor(s / _day)
  let hour = Math.floor((s - day * _day) / _hour)
  let minute = Math.floor((s - day * _day - hour * _hour) / _minute)
  let second = Math.floor((s - day * _day - hour * _hour - minute * _minute))
  return {
    day,
    hour,
    minute,
    second
  }
}
