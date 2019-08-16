import React from 'react'
import { resetLocationHistory, LocationAction, LocationStore } from 'bdux-react-router'
import { createRoot } from 'bdux-universal'
import Head from '../components/head'

export const renderElement = ({ dispatch }, req) => {
  dispatch(LocationAction.listen())
  resetLocationHistory(req.path)
  return <Head isStandAlone />
}

export default createRoot(
  renderElement, {
    location: LocationStore,
  }
)
