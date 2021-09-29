import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux'
import * as CatalogueAction from '../actions/catalogue-action'
import CatalogueStore from '../stores/catalogue-store'
import Product from './product'

const List = styled.ul`
  min-height: calc(100vh - 57px);
  margin: 57px 0 0 83px;
  animation: 500ms catalogue-fadein;
  @keyframes catalogue-fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (orientation: portrait) {
    margin: 81px 0 0 20px;
  }
`

// eslint-disable-next-line react/display-name
const renderProduct = (selected, query) => (product) => (
  <Product
    key={product.id}
    product={product}
    selected={selected}
    query={query}
  />
)

const renderCatalogue = (catalogue, query) => (
  catalogue && catalogue.products
    && catalogue.products.map(renderProduct(catalogue.selected, query))
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

  return useMemo(() => (
    <List key={category}>
      {renderCatalogue(catalogue, query)}
    </List>
  ), [catalogue, category, query])
}

export default Catalogue
