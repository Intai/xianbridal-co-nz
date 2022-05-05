import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
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
const renderProduct = (selected, query, backUrl) => (product, index) => (
  <Product
    backUrl={backUrl}
    importance={index <= 1 ? 'high' : 'auto'}
    key={product.id}
    product={product}
    query={query}
    selected={selected}
  />
)

const renderCatalogue = (catalogue, query, backUrl) => (
  catalogue && catalogue.products
    && catalogue.products.map(renderProduct(catalogue.selected, query, backUrl))
)

const useBdux = createUseBdux({
  catalogue: CatalogueStore,
})

const Catalogue = (props) => {
  const { category = 'search', query, id } = useParams()
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
        : renderCatalogue(catalogue, query, getBackUrl(query, id))}
    </List>
  ), [catalogue, category, id, isEmpty, query])
}

export default Catalogue
