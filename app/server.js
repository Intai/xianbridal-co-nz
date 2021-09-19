import './settings'
import fs from 'fs'
import express from 'express'
import { ServerStyleSheet } from 'styled-components'
import HeadRoot from './roots/head-root'
import AppRoot from './roots/app-root'

const app = express()
const port = process.env.PORT || 8080
const defaultDigest = Date.now()

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

const serviceWorker = (req, res) => {
  fs.readFile('./dist/service-worker.js', 'utf8', function (err, data) {
    if (err) {
      throw err
    }

    const image = process.env.CONTAINER_IMAGE
    const digest = image ? image.replace(/^.*@sha256:/, '') : defaultDigest
    const replaced = data.replace('<DIGEST>', digest)
    res.set('Content-Type', 'application/javascript')
    res.send(replaced)
  })
}

app.set('etag', 'weak')
app.use('/static', express.static('dist'))
app.use('/favicon.ico', express.static('dist/favicon'))
app.get('/service-worker', serviceWorker)
app.get('*', renderApp)

app.listen(port)
