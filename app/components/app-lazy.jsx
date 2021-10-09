import React from 'react'
import ReactDOM from 'react-dom'
import BduxContext from 'bdux/context'
import { createDispatcher } from 'bdux/dispatcher'
import { hasUniversalStates } from 'bdux-universal/has-universal-states'
import App from './app'

const bduxContext = {
  dispatcher: createDispatcher(),
  stores: new WeakMap(),
}

const renderApp = () => (
  <BduxContext.Provider value={bduxContext}>
    <App />
  </BduxContext.Provider>
)

const ReactDOMRender = hasUniversalStates()
  ? ReactDOM.hydrate
  : ReactDOM.render

ReactDOMRender(
  renderApp(),
  document.getElementById('app'),
)
