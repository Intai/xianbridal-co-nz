import React from 'react'
import { resetLocationHistory, LocationStore } from 'bdux-react-router'
import { createRoot } from 'bdux-universal'
import App from '../components/app.prod'

export const renderElement = (_, req) => {
  resetLocationHistory(req.path)
  return <App />
}

export default createRoot(
  renderElement, {
    location: LocationStore,
  }
)
