import React from 'react'
import { resetLocationHistory, LocationAction, LocationStore } from 'bdux-react-router'
import { createRoot } from 'bdux-universal'
import App from '../components/app.prod'

export const renderElement = ({ dispatch }, req, _res, sheet) => {
  dispatch(LocationAction.listen())
  resetLocationHistory(req.path)
  return sheet.collectStyles(<App />)
}

export default createRoot(
  renderElement, {
    location: LocationStore,
  },
)
