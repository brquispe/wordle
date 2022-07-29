//  @ts-check
import { WordRepository } from '../data/WordRepository.js'
import { GameUIStatus, Wordle } from './Game/Wordle.js'

const wordleWrapper = document.getElementById('wordle')
const playButton = document.createElement('button')
playButton.classList.add('btnPlay')
playButton.innerText = 'Jugar'
const repository = new WordRepository()
repository.loadWords().then(() => {
  const word = repository.getRandomWord()
  console.log(word)
  const newGame = new Wordle(word.toUpperCase())
  const startGame = () => {
    if (newGame.status === GameUIStatus.LOBBY) {
      wordleWrapper?.appendChild(newGame.elem)
      newGame.startGame()
      playButton.parentElement?.removeChild(playButton)
    }
  }
  playButton.addEventListener('click', startGame)
  wordleWrapper?.appendChild(playButton)
})

// console.log(keyboard)
