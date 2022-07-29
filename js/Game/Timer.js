// @ts-check
export class Timer {
  /** @type {HTMLElement} */
  element

  beepSound = new Audio('../../sounds/beep.wav')
  #percentageWarning = 50
  #percentageDanger = 25

  constructor () {
    this.element = document.createElement('div')
    this.element.classList.add('timer')
    this.beepSound.playbackRate = 3
  }

  /** @param {number} seconds */
  startCountdown (seconds) {
    this.beepSound.pause()
    const intervalRate = Timer.convertSecondsToMS(1)
    const startTime = Timer.convertSecondsToMS(seconds)
    let time = startTime
    const calculatePercentage = (number, percentage) => {
      return number * percentage / 100
    }
    const interval = setInterval(() => {
      time -= intervalRate
      if (time <= 0) {
        clearInterval(interval)
      }
      this.element.innerText = this.convertTimeToMMSS(time)
      if (time < calculatePercentage(startTime, this.#percentageWarning) && time > calculatePercentage(startTime, this.#percentageDanger)) {
        this.element.classList.toggle('warning', true)
      } else if (time < calculatePercentage(startTime, this.#percentageDanger)) {
        this.element.classList.remove('warning')
        this.element.classList.toggle('danger', true)
        this.beepSound.play()
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
