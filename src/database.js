import * as fs from 'node:fs/promises'
import { Task } from './models/Task.js'

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

  selectIndexById(table, id) {
    if (!this.#database[table]) {
      return null
    }

    const indexItem = Array.from(this.#database[table]).findIndex(task => {
      return task.id == id
    })

    if (Number(indexItem) == -1) {
      return null
    }

    return Number(indexItem)
  }

  update(table, id, data) {
    const item = this.selectIndexById(table, id)
    if (item === null) {
      throw new Error('Id Inválido')
    }

    const task = new Task()

    task.factory(this.#database[table][item])

    task.update(data.title, data.description)

    this.#database[table][item] = task

    this.#persist()

    return task
  }


}