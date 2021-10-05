import './settings'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BduxContext, createDispatcher } from 'bdux'
import { hasUniversalStates } from 'bdux-universal'

// register service worker for offline cache.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker').then()
    navigator.serviceWorker.register('https://images.xianbridal.co.nz/service-worker.js').then()
  })
}

const bduxContext = {
  dispatcher: createDispatcher(),
  stores: new WeakMap(),
}

const ReactDOMRender = hasUniversalStates()
  ? ReactDOM.hydrate
  : ReactDOM.render

const App = React.lazy(() => (
  import(/* webpackChunkName: "app" */ './components/app')
))

const renderApp = () => (
  <Suspense fallback={false}>
    <BduxContext.Provider value={bduxContext}>
      <App />
    </BduxContext.Provider>
  </Suspense>
)

ReactDOMRender(
  renderApp(),
  document.getElementById('app'),
)
