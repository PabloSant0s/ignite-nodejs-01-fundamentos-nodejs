import crypto from 'node:crypto'

export class Task {
  #id
  #title
  #description
  #completed_at
  #created_at
  #updated_at

  constructor(title, description) {
    this.#id = crypto.randomUUID()
    this.#title = title
    this.#description = description
    this.#completed_at = null
    this.#created_at = new Date()
    this.#updated_at = new Date()
  }

  factory(source) {
    if (source.id) this.#id = source.id
    if (source.title) this.#title = source.title
    if (source.description) this.#description = source.description
    if (source.completed_at) this.#completed_at = source.completed_at
    if (source.created_at) this.#created_at = source.created_at
    if (source.updated_at) this.#updated_at = source.updated_at
  }

  get id() {
    return this.#id
  }

  get title() {
    return this.#title
  }

  get description() {
    return this.#description
  }

  get created_at() {
    return this.#completed_at
  }

  get created_at() {
    return this.#created_at
  }

  get updated_at() {
    return this.#updated_at
  }

  update(title, description) {
    if (title || description) {
      if (title) this.#title = title
      if (description) this.#description = description
      this.#updated_at = new Date()
    }
  }

  completed() {
    this.#completed_at = new Date()
  }
}