import './settings'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import BduxContext from 'bdux/context'
import { createDispatcher } from 'bdux/dispatcher'
import { hasUniversalStates } from 'bdux-universal/has-universal-states'
import App from './components/app'

// register service worker for offline cache.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker').then()
  })
}

const bduxContext = {
  dispatcher: createDispatcher(),
  stores: new WeakMap(),
}

const renderApp = () => (
  <Suspense fallback={false}>
    <BduxContext.Provider value={bduxContext}>
      <App />
    </BduxContext.Provider>
  </Suspense>
)

const ReactDOMRender = hasUniversalStates()
  ? ReactDOM.hydrate
  : ReactDOM.render

ReactDOMRender(
  renderApp(),
  document.getElementById('app'),
)
