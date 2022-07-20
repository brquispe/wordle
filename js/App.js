
import { Wordle } from './Game/Wordle.js'

const wordleWrapper = document.getElementById('wordle')

const newGame = new Wordle('LIBRO')
wordleWrapper?.appendChild(newGame.elem)
// console.log(keyboard)
