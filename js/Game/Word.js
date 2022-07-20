// @ts-check
import { LetterInput, LetterStatus } from './LetterInput.js'

export class Word {
  /** @type {LetterInput[]} */
  letters = []
  /** @type {Element} element */
  element
  static MAX_LETTERS = 5

  constructor (word = '') {
    // if (!letterInputRefs) {
    //   word.split('').forEach((letter, index) => {
    //     this.letters.push(new LetterInput(letter, index))
    //   })
    //   return
    // }
    if (word.length > 0) {
      Array.from(word).forEach((letter, i) => {
        const newLetter = new LetterInput(i, letter)
        this.letters.push(newLetter)
      })
    } else {
      for (let i = 0; i < Word.MAX_LETTERS; i++) {
        const newLetter = new LetterInput(i)
        this.letters.push(newLetter)
      }
    }
    this.initializeElement()
  }

  get word () {
    const word = this.letters.reduce((prevChar, letter) => prevChar + letter.letter ?? '', '')
    return word
  }

  initializeElement () {
    this.element = document.createElement('div')
    this.element.classList.add('word')
    this.letters.forEach(letter => {
      this.element.appendChild(letter.element)
    })
  }

  refreshColors () {
    this.letters.forEach(letter => {
      let colorClass = 'notincluded'
      if (letter.status === LetterStatus.INCLUDED) {
        colorClass = 'included'
      }
      if (letter.status === LetterStatus.MATCHED) {
        colorClass = 'matched'
      }
      letter.element.classList.toggle(colorClass, true)
    })
  }

  /** @param {string} word */
  static async digest (word) {
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(word)).then(async (hash) => {
      Array.prototype.map
        .call(
          new Uint8Array(
            await crypto.subtle.digest('SHA-256', new TextEncoder().encode(word))
          ),
          (x) => ('0' + x.toString(16)).slice(-2)
        )
        .join()
    })
  }
}
