import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux/hook'
import Product from './product'
import EmptySearchResult from './empty-search-result'
import * as CatalogueAction from '../actions/catalogue-action'
import CatalogueStore from '../stores/catalogue-store'
import { decodeSku } from '../utils/common-util'

const emptyMarginRight = ({ isEmpty }) => isEmpty
  && 'margin-right: 20px;'

const List = styled.ul`
  min-height: calc(100vh - 57px);
  margin: 57px 0 0 83px;
  ${emptyMarginRight}

  @media (orientation: portrait), (max-width: 632px) {
    margin-top: 81px;
    margin-left: 20px;
  }
`

const getBackUrl = (query, id) => {
  if (query && id) {
    return `/search/${query}`
  } if (query) {
    return '/'
  }
  return null
}

// eslint-disable-next-line react/display-name
const renderProduct = (selected, query, id, backUrl) => (product, index) => (
  <Product
    backUrl={backUrl}
    importance={!id && index <= 1 ? 'high' : 'auto'}
    key={product.id}
    product={product}
    query={query}
    selected={selected}
  />
)

const renderCatalogue = (catalogue, query, id, backUrl) => (
  catalogue && catalogue.products
    && catalogue.products.map(renderProduct(catalogue.selected, query, id, backUrl))
)

const useBdux = createUseBdux({
  catalogue: CatalogueStore,
})

const Catalogue = (props) => {
  const { match: { params: { category = 'search', query, id } } } = props
  const { state, dispatch } = useBdux(props)
  const { catalogue } = state

  useEffect(() => {
    dispatch(CatalogueAction.load(category, query, decodeSku(id)))
  }, [category, dispatch, id, query])

  const isEmpty = category == 'search'
    && catalogue && catalogue.products.length <= 0

  return useMemo(() => (
    <List
      key={category}
      isEmpty={isEmpty}
    >
      {isEmpty
        ? <EmptySearchResult />
        : renderCatalogue(catalogue, query, id, getBackUrl(query, id))}
    </List>
  ), [catalogue, category, id, isEmpty, query])
}

export default Catalogue
