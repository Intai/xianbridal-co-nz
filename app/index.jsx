import './settings'
import React from 'react'
import ReactDOM from 'react-dom'
import { BduxContext, createDispatcher } from 'bdux'
import { hasUniversalStates } from 'bdux-universal'

const bduxContext = {
  dispatcher: createDispatcher(),
  stores: new WeakMap()
}

const ReactDOMRender = hasUniversalStates()
  ? ReactDOM.hydrate
  : ReactDOM.render

import(/* webpackChunkName: "app" */ './components/app').then(({ default: App }) => {
  const renderApp = () => (
    <BduxContext.Provider value={bduxContext}>
      <App />
    </BduxContext.Provider>
  )

  ReactDOMRender(
    renderApp(),
    document.getElementById('app')
  )
})
