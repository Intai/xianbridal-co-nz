import React from 'react'
import { resetLocationHistory, LocationAction, LocationStore } from 'bdux-react-router'
import { createRoot } from 'bdux-universal'
import { extractPathParams } from './routes'
import * as CatalogueAction from '../actions/catalogue-action'
import CatalogueStore from '../stores/catalogue-store'
import { ProductDetailsForSeo } from '../components/product-details'
import { decodeSku } from '../utils/common-util'

export const renderElement = ({ dispatch }, req, _res, sheet) => {
  const { path } = req
  const { category, query, id } = extractPathParams(path)

  dispatch(LocationAction.listen())
  resetLocationHistory(path)
  if (category) {
    dispatch(CatalogueAction.load(category, query, decodeSku(id)))
  }
  return sheet.collectStyles(<ProductDetailsForSeo />)
}

export default createRoot(
  renderElement, {
    location: LocationStore,
    catalogue: CatalogueStore,
  },
)
