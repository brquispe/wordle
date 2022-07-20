// @ts-check
// eslint-disable-next-line no-unused-vars
import { WordRepository } from '../../data/WordRepository.js'
import { LetterInput, LetterStatus } from './LetterInput.js'
import { Scoreboard } from './Scoreboard.js'
import { Word } from './Word.js'

export const GameStatus = Object.freeze({
  IN_PROGRESS: 0,
  VICTORY: 1,
  DEFEAT: 2
})

export class Gameboard {
  #wordToGuess
  /** @type {Scoreboard} */
  scoreboard
  status = GameStatus.IN_PROGRESS
  /**
   * @type {{
   *  matched: LetterInput[],
   *  included: LetterInput[],
   *  notIncluded: LetterInput[],
   * }}
   */
  score = {
    matched: [],
    included: [],
    notIncluded: []
  }

  round = 1

  get wordToGuess () { return this.#wordToGuess }

  /**
   *
   * @param {Word} wordToGuess
   */
  constructor (wordToGuess) {
    this.#wordToGuess = wordToGuess
    this.scoreboard = new Scoreboard()
    this.repository = new WordRepository()
    // console.log('SCORE ROUND:', this.scoreboard.enteredWords.length + 1)
    // this.round = this.scoreboard.enteredWords.length > 0 ? this.scoreboard.enteredWords.length + 1 : 1
  }

  // addWord = (word) => {
  //   this.words.push(new Word(word))
  // }

  /** @param {Word} word */
  validateWord = (word, addToScore = true) => {
    const wordExist = this.repository.findWord(word.word)
    if (!wordExist) {
      alert('La palabra no está en la lista')
      return false
    }
    console.log(wordExist)
    console.log('COMPARING: ', ...word.letters.map(letter => letter.letter))
    console.log('AND: ', ...this.#wordToGuess.letters.map(letter => letter.letter))
    let currentScore = 0
    for (const letter of word.letters) {
      if (!this.#wordToGuess.letters.some(l => l.letter === letter.letter)) {
        this.score.notIncluded.push(letter)
        // letter.inputRef.classList.add('notincludes')
        letter.status = LetterStatus.NOT_INCLUDED
        continue
      }
      const letterAtSameIndex = this.#wordToGuess.letters.find(l => l.index === letter.index)
      if (letter.letter === letterAtSameIndex?.letter) {
        this.score.matched.push(letter)
        // letter.inputRef.classList.add('match')
        letter.status = LetterStatus.MATCHED
        currentScore++
        continue
      }
      this.score.included.push(letter)
      // letter.inputRef.classList.add('includes')
      letter.status = LetterStatus.INCLUDED
    }

    word.refreshColors()
    // word.element.disabled = true
    if (addToScore) {
      this.scoreboard.addWordToScore(word)
    }
    if (currentScore === Word.MAX_LETTERS) {
      this.status = GameStatus.VICTORY
      return
    }
    this.round++
    return true
  }
}
