export class WordRepository {
  #words = []

  async initWords () {
    const words = await fetch('./data/words.json')
    const data = await words.json()
    this.#words = data
  }

  findWord (word) {
    console.log(this.#words.length)
    const normalizedWord = this.#normalizeWord(word)
    console.log(normalizedWord)
    const index = this.#words.findIndex(w => w === normalizedWord)
    console.log(word.toLowerCase(), index)
    return this.#words.some(w => this.#normalizeWord(w) === normalizedWord)
  }

  async loadWords () {
    return fetch('./data/words.json').then(data => data.json())
      .then(words => {
        console.log(words)
        this.#words = words
      })
  }

  #normalizeWord (word) {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  }
}
