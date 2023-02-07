import { Database } from './database.js'
import { Task } from './models/Task.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { execute } from './utils/csv/import-csv.js'

const database = new Database()
export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/'),
    handler: (req, res) => {
      return res.end('Ola Ignite')
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const { title, description } = req.body


      if (!title || !description) {
        const error = {
          body: {}
        }

        if (!title) error.body['title'] = 'Title is required'
        if (!description) error.body['description'] = 'Description is required'

        return res.writeHead(400).end(JSON.stringify(error))
      }

      const task = new Task(title, description)

      database.insert('tasks', task)
      return res.writeHead(201).end(JSON.stringify(task))

    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const { title, description } = req.query


      const tasks = database.select('tasks', title, description)
      return res.end(JSON.stringify(tasks))

    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      try {
        const task = database.update('tasks', id, { title, description })
        return res.writeHead(200).end(JSON.stringify(task))
      } catch (error) {
        if (error instanceof Error) {
          return res.writeHead(404).end(JSON.stringify({
            error: {
              default: error.message
            }
          }))
        }
        return res.writeHead(500).end(JSON.stringify({
          error: {
            default: 'Internal Server Error'
          }
        }))
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.delete('tasks', id)
        return res.writeHead(204).end()
      } catch (error) {
        if (error instanceof Error) {
          return res.writeHead(404).end(JSON.stringify({
            error: {
              default: error.message
            }
          }))
        }
        return res.writeHead(500).end(JSON.stringify({
          error: {
            default: 'Internal Server Error'
          }
        }))
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        const task = database.completeTask('tasks', id)
        return res.writeHead(200).end(JSON.stringify(task))
      } catch (error) {
        if (error instanceof Error) {
          return res.writeHead(404).end(JSON.stringify({
            error: {
              default: error.message
            }
          }))
        }
        return res.writeHead(500).end(JSON.stringify({
          error: {
            default: 'Internal Server Error'
          }
        }))
      }
    }
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks/import'),
    handler: async (req, res) => {
      try {
        await execute()
        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(500).end()
      }

    }
  }
]