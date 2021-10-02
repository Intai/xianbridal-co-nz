import React from 'react'
import { resetLocationHistory, LocationAction, LocationStore } from 'bdux-react-router'
import { createRoot } from 'bdux-universal'
import * as CatalogueAction from '../actions/catalogue-action'
import CatalogueStore from '../stores/catalogue-store'
import App from '../components/app.prod'
import { decodeSku } from '../utils/common-util'

const extractPathParams = path => {
  const matches = path.match(/^\/([^/]*)(\/([^/]*))?(\/([^/]*))?/i) || []
  const category = matches[1] || null

  if (!category || category === 'static') {
    return {
      category: null,
      query: null,
      id: null,
    }
  }
  if (matches.length >= 6) {
    return {
      category,
      query: matches[3],
      id: matches[5],
    }
  }
  return {
    category,
    query: null,
    id: matches[3] || null,
  }
}

export const renderElement = ({ dispatch }, req, _res, sheet) => {
  const { path } = req
  const { category, query, id } = extractPathParams(path)

  dispatch(LocationAction.listen())
  resetLocationHistory(path)
  if (category) {
    dispatch(CatalogueAction.load(category, query, decodeSku(id)))
  }
  return sheet.collectStyles(<App />)
}

export default createRoot(
  renderElement, {
    location: LocationStore,
    catalogue: CatalogueStore,
  },
)
