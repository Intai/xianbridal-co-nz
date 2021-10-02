import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux'
import EmptySearchResult from './empty-search-result'
import * as CatalogueAction from '../actions/catalogue-action'
import CatalogueStore from '../stores/catalogue-store'
import Product from './product'

const emptyMarginRight = ({ isEmpty }) => isEmpty
  && 'margin-right: 20px;'

const List = styled.ul`
  min-height: calc(100vh - 57px);
  margin: 57px 0 0 83px;
  animation: 500ms catalogue-fadein;
  ${emptyMarginRight}

  @keyframes catalogue-fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

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
const renderProduct = (selected, query, backUrl) => (product) => (
  <Product
    key={product.id}
    product={product}
    selected={selected}
    query={query}
    backUrl={backUrl}
  />
)

const renderCatalogue = (catalogue, query, backUrl) => (
  catalogue && catalogue.products
    && catalogue.products.map(renderProduct(catalogue.selected, query, backUrl))
)

const useBdux = createUseBdux({
  catalogue: CatalogueStore,
}, [
  CatalogueAction.init,
])

const Catalogue = (props) => {
  const { match: { params: { category = 'search', query, id } } } = props
  const { state, dispatch } = useBdux(props)
  const { catalogue } = state

  useEffect(() => {
    dispatch(CatalogueAction.load(category, query, id))
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
        : renderCatalogue(catalogue, query, getBackUrl(query, id))}
    </List>
  ), [catalogue, category, id, isEmpty, query])
}

export default Catalogue
