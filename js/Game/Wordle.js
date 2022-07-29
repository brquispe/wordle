// @ts-check

// eslint-disable-next-line no-unused-vars
import { Key } from '../Keyboard/Key.js'
import { Keyboard } from '../Keyboard/Keyboard.js'
import { Gameboard, GameStatus } from './Gameboard.js'
import { Timer } from './Timer.js'
import { Word } from './Word.js'

export const GameUIStatus = Object.freeze({
  LOBBY: 0,
  PLAYING: 1,
  HOWTOPLAYMENU: 2
})

export class Wordle {
  status = GameUIStatus.LOBBY
  gameboard
  /** @type {Keyboard} */
  keyboard
  playerName = ''
  currentLetter = {
    wordNumber: 0,
    letterNumber: 0
  }

  /** @type {Timer} */
  timer

  /** @type {HTMLDivElement} */
  elem

  /** @type {Word[]} */
  wordInputs = []
  /**
   * @param {string} word
   */
  constructor (word) {
    if (word.length > Word.MAX_LETTERS) {
      throw new Error('Word cannot be longer than ' + Word.MAX_LETTERS + ' letters')
    }
    Word.digest(word).then(hash => {
      console.log(hash)
    })
    this.gameboard = new Gameboard(new Word(word))
    // this.currentLetter.wordNumber = this.gameboard.round - 1
    // this.initializeElement()
    this.elem = document.createElement('div')
    this.elem.id = 'wordleContainer'
    this.elem.classList.add('container')
  }

  initializeElement () {
    // this.elem = document.createElement('div')
    this.timer = new Timer()
    this.timer.startCountdown(15)
    const btnShowHowToPlay = document.createElement('button')
    btnShowHowToPlay.type = 'button'
    btnShowHowToPlay.title = 'Mostrar cómo jugar'
    btnShowHowToPlay.innerText = '?'
    btnShowHowToPlay.addEventListener('click', this.showHowToPlay.bind(this))
    btnShowHowToPlay.classList.add('btnShowHowToPlay')
    this.elem.appendChild(btnShowHowToPlay)
    this.elem.appendChild(this.timer.element)
    const wordleWrapper = document.createElement('div')
    wordleWrapper.classList.add('wordle')
    this.gameboard.repository.loadWords().then(() => {
      for (let i = 0; i < 6; i++) {
        const word = this.gameboard?.scoreboard?.enteredWords[i] ?? undefined
        const newWord = new Word(this.gameboard.scoreboard.enteredWords[i] || '')
        this.wordInputs.push(newWord)
        if (word) {
          this.validateWord(false)
        }
        wordleWrapper.appendChild(newWord.element)
      }
      this.keyboard = new Keyboard(this.onPressKey.bind(this))
      this.elem.appendChild(wordleWrapper)
      this.elem.appendChild(this.keyboard.element)
      this.refreshKeys()
    })
  }

  validateWord (addToScore = true) {
    // const formData = new FormData(e.target)
    // console.log(formData.keys())
    const round = this.gameboard.round - 1
    const word = this.wordInputs[round]
    console.log(word)
    console.log(word.letters)
    if (word.letters.some(letter => letter.isEmpty())) {
      alert('Not enough letters')
      return
    }
    console.log(word)
    console.log(this.wordInputs)
    if (this.gameboard.validateWord(word, addToScore)) {
      this.currentLetter.wordNumber++
      this.currentLetter.letterNumber = 0
    }
    // this.enableNextWordInputs()
  }

  refreshKeys () {
    const letters = this.wordInputs.flatMap(word => word.letters)
    this.keyboard.refreshKeys(letters)
  }

  /**
   * @param {Key} key
   */
  onPressKey (key) {
    // console.log(this.currentLetter)
    if (this.status !== GameUIStatus.PLAYING || this.gameboard.status === GameStatus.VICTORY) {
      return
    }
    const currentLetterInput = this.wordInputs[this.currentLetter.wordNumber].letters[this.currentLetter.letterNumber]
    switch (key.code) {
      case 'Enter': {
        this.validateWord()
        this.refreshKeys()
        break
      }
      case 'Backspace': {
        if (this.currentLetter.letterNumber <= 0) {
          return
        }
        const previousLetterInput = this.wordInputs[this.currentLetter.wordNumber].letters[this.currentLetter.letterNumber - 1]
        previousLetterInput.letter = ''
        this.currentLetter.letterNumber--
        break
      }
      default:
        if (this.currentLetter.letterNumber >= Word.MAX_LETTERS) {
          return
        }
        currentLetterInput.letter = key.key
        this.currentLetter.letterNumber++
        break
    }
  }

  startGame () {
    console.log('START!')
    const nameInput = document.createElement('div')
    const formName = document.createElement('form')
    nameInput.appendChild(formName)
    formName.innerHTML = `
      <label for="name">Nombre</label>
      <input type="text" name="name" id="name" />
      <button class="key enter" type="submit" title="Empezar">Empezar</button>`
    this.elem.classList.add('wordle', 'frmPlayerName')
    formName.addEventListener('submit', (e) => {
      e.preventDefault()
      const formData = new FormData(formName)
      const name = formData.get('name')
      alert(`Bienvenido, ${name}`)
      this.playerName = name?.toString() || ''
      this.status = GameUIStatus.PLAYING
      this.elem.removeChild(nameInput)
      this.initializeElement()
    })
    this.elem.appendChild(nameInput)
  }

  showHowToPlay () {
    if (this.status === GameUIStatus.HOWTOPLAYMENU) return
    this.status = GameUIStatus.HOWTOPLAYMENU
    const elem = document.createElement('div')
    elem.classList.add('info')
    elem.innerHTML = `
      <div class="info__header">
        <button id="btnCloseHowToPlay" type="button" title="Cerrar">&times;</button>
      </div>
      <h1>Cómo jugar</h1>
      <p>Adiviná la palabra oculta en seis intentos</p>
      <p>Cada intento debe ser una palabra válida de cinco letras</p>
      <p>Después de cada intento el color de las letras cambia para mostrar qué tanto te acercaste a la palabra</p>
      <p><strong>Ejemplos</strong></p>
      <div class="word">
        <div class="letter matched">L</div>
        <div class="letter">E</div>
        <div class="letter">T</div>
        <div class="letter">R</div>
        <div class="letter">A</div>
      </div>
      <p>La letra <strong>L</strong> está en la palabra y en la posición correcta</p>
      <div class="word">
        <div class="letter">B</div>
        <div class="letter">R</div>
        <div class="letter included">O</div>
        <div class="letter">T</div>
        <div class="letter">E</div>
      </div>
      <p>La letra <strong>O</strong> está en la palabra pero no en la posición correcta</p>
      <div class="word">
        <div class="letter">B</div>
        <div class="letter">O</div>
        <div class="letter">L</div>
        <div class="letter">S</div>
        <div class="letter notincluded">A</div>
      </div>
      <p>La letra <strong>A</strong> no está en la palabra</p>
      <p>Puede haber letras repetidas y en ese caso, las pistas son independientes para cada letra y tienen prioridad</p>
    `
    elem.querySelector('#btnCloseHowToPlay')?.addEventListener('click', () => {
      this.status = GameUIStatus.PLAYING
      this.elem.removeChild(elem)
    })
    this.elem.appendChild(elem)
  }
}
