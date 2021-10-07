import './settings'
import fs from 'fs'
import express from 'express'
import { ServerStyleSheet } from 'styled-components'
import HeadRoot from './roots/head-root'
import AppRoot from './roots/app-root'
import PortalRoot from './roots/portal-root'

const app = express()
const port = process.env.PORT || 8080
const defaultDigest = Date.now()

const renderApp = (req, res) => {
  const image = process.env.CONTAINER_IMAGE
  const digest = image ? image.replace(/^.*@sha256:/, '') : defaultDigest
  const etag = `W/"${digest}"`

  if (req.header('If-None-Match') === etag) {
    res.sendStatus(304)
    return
  }

  fs.readFile('./dist/server.ejs', 'utf8', (err, file) => {
    if (err) {
      throw err
    }

    const [head, afterHead] = file.split('<%- head %>')
    const [beforeApp, afterApp] = afterHead.split('<%- app %>')
    const [beforePortal, tail] = afterApp.split('<%- portal %>')
    res.set('Content-Type', 'text/html')
    res.set('Etag', etag)
    res.write(head)
    res.write(HeadRoot.renderToString(req, res))
    res.write(beforeApp)
    const sheetApp = new ServerStyleSheet()
    const stream = sheetApp.interleaveWithNodeStream(
      AppRoot.renderToNodeStream(req, res, sheetApp))
    stream.pipe(res, { end: false })
    stream.on('end', () => {
      res.write(beforePortal)
      res.write(PortalRoot.renderToString(req, res))
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
app.use('/static', express.static('dist', { maxAge: 15552000000 }))
app.use('/favicon.ico', express.static('dist/favicon'))
app.get('/service-worker', serviceWorker)
app.get('*', renderApp)

app.listen(port)
