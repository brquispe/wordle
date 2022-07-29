//  @ts-check
import { GameUIStatus, Wordle } from './Game/Wordle.js'

const wordleWrapper = document.getElementById('wordle')
const playButton = document.createElement('button')
playButton.classList.add('btnPlay')
playButton.innerText = 'Jugar'
const newGame = new Wordle('LIBRO')
const startGame = () => {
  if (newGame.status === GameUIStatus.LOBBY) {
    wordleWrapper?.appendChild(newGame.elem)
    newGame.startGame()
    playButton.parentElement?.removeChild(playButton)
  }
}
playButton.addEventListener('click', startGame)
wordleWrapper?.appendChild(playButton)

// console.log(keyboard)
