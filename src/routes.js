import { Database } from './database.js'
import { Task } from './models/Task.js'
import { buildRoutePath } from './utils/build-route-path.js'

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
  }
]