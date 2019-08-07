/* eslint-env node */

import './settings'
import fs from 'fs'
import { curry } from 'ramda'
import Express from 'express'
import DefaultRoot from './roots/default-root'

const app = Express()
const port = process.env.PORT || 8080

const renderApp = curry((root, req, res) => {
  fs.readFile('./dist/server.ejs', 'utf8', (err, file) => {
    if (err) {
      throw err
    }

    const [head, tail] = file.split('<%- app %>')
    res.write(head)
    const stream = root.renderToNodeStream(req, res)
    stream.pipe(res, { end: false })
    stream.on('end', () => {
      res.write(tail)
      res.end()
    })
  })
})

app.use('/static', Express.static('dist'))
app.use('/favicon.ico', Express.static('dist'))
app.get('*', renderApp(DefaultRoot))

app.listen(port)