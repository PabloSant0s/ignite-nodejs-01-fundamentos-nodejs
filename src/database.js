import * as fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}
  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    this.#database[table] ? this.#database[table].push(data) : this.#database[table] = [data]
    this.#persist()
    return data
  }

  select(table, title, description) {
    let filteredTasks = []

    if (!this.#database[table]) {
      return filteredTasks
    }

    if (title && description) {
      filteredTasks = Array.from(this.#database[table]).filter(task => String(task.title).includes(title) && String(task.description).includes(description))
    } else if (title) {
      filteredTasks = Array.from(this.#database[table]).filter(task => String(task.title).includes(title))
    } else if (description) {
      filteredTasks = Array.from(this.#database[table]).filter(task => String(task.description).includes(description))
    } else {
      filteredTasks = Array.from(this.#database[table])
    }

    return filteredTasks
  }


}