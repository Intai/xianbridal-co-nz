import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux'
import * as CatalogueAction from '../actions/catalogue-action'
import CatalogueStore from '../stores/catalogue-store'
import Product from './product'

const List = styled.ul`
  min-height: calc(100vh - 72px);
  margin: 57px 15px 15px 83px;
  animation: 500ms catalogue-fadein;
  @keyframes catalogue-fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const renderProduct = (product) => (
  <Product
    key={product.id}
    product={product}
  />
)

const renderCatalogue = (catalogue) => (
  catalogue && catalogue.products
    && catalogue.products.map(renderProduct)
)

const useBdux = createUseBdux(
  { catalogue: CatalogueStore },
  CatalogueAction.init
)

const Catalogue = (props) => {
  const { location, match: { params: { category, id } } } = props
  const { state, dispatch } = useBdux(props)
  const { catalogue } = state

  useEffect(() => {
    dispatch(CatalogueAction.load(category, id))
  }, [location])

  return useMemo(() => (
    <List key={category}>
      {renderCatalogue(catalogue)}
    </List>
  ), [catalogue])
}

export default Catalogue
