// eslint-disable-next-line no-unused-vars
import { Word } from './Word.js'

export class Scoreboard {
  #SCORE_KEY = 'wordle_score'
  /** @type {string[]} */
  enteredWords
  constructor () {
    this.enteredWords = []
    this.initScore()
  }

  /** @param {Word} word */
  addWordToScore (word) {
    this.enteredWords.push(word.word)
    localStorage.setItem(this.#SCORE_KEY, JSON.stringify(this.enteredWords))
  }

  initScore () {
    const score = localStorage.getItem(this.#SCORE_KEY)
    if (score) {
      this.enteredWords = JSON.parse(score)
      console.log(this.enteredWords)
    }
  }
}
