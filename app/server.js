/* eslint-env node */

import './settings'
import fs from 'fs'
import Express from 'express'
import { ServerStyleSheet } from 'styled-components'
import HeadRoot from './roots/head-root'
import AppRoot from './roots/app-root'

const app = Express()
const port = process.env.PORT || 8080

const renderApp = (req, res) => {
  fs.readFile('./dist/server.ejs', 'utf8', (err, file) => {
    if (err) {
      throw err
    }

    const [head, rest] = file.split('<%- head %>')
    const [middle, tail] = rest.split('<%- app %>')
    res.write(head)
    res.write(HeadRoot.renderToString(req, res))
    res.write(middle)
    const sheet = new ServerStyleSheet()
    const stream = sheet.interleaveWithNodeStream(
      AppRoot.renderToNodeStream(req, res, sheet))
    stream.pipe(res, { end: false })
    stream.on('end', () => {
      res.write(tail)
      res.end()
    })
  })
}

app.use('/static', Express.static('dist'))
app.use('/favicon.ico', Express.static('dist'))
app.get('*', renderApp)

app.listen(port)
