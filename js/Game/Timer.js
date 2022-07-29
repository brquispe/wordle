// @ts-check
export class Timer {
  /** @type {HTMLElement} */
  element

  constructor () {
    this.element = document.createElement('div')
    this.element.classList.add('timer')
  }

  /** @param {number} seconds */
  startCountdown (seconds) {
    const intervalRate = Timer.convertSecondsToMS(1)
    const startTime = Timer.convertSecondsToMS(seconds)
    let time = startTime
    const interval = setInterval(() => {
      time -= intervalRate
      if (time <= 0) {
        clearInterval(interval)
      }
      this.element.innerText = this.convertTimeToMMSS(time)
      if (time < startTime * 0.6 && time > startTime * 0.3) {
        this.element.classList.toggle('warning', true)
      } else if (time < startTime * 0.3) {
        this.element.classList.remove('warning')
        this.element.classList.toggle('danger', true)
      }
    }, intervalRate)
    console.log(interval)
  }

  /** @param {number} ms */
  convertTimeToMMSS (ms) {
    const seconds = ms / 1000
    const minutes = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  /** @param {number} seconds */
  static convertSecondsToMS (seconds) {
    return seconds * 1000
  }

  /** @param {number} minutes */
  static convertMinutesToSeconds (minutes) {
    return minutes * 60
  }
}
