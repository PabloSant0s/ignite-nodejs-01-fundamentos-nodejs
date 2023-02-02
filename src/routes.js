import { buildRoutePath } from './utils/build-route-path.js'

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/'),
    handler: (req, res) => {
      return res.end('Ola Ignite')
    }
  }
]