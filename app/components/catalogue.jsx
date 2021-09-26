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
const renderProduct = (selected) => (product) => (
  <Product
    key={product.id}
    product={product}
    selected={selected}
  />
)

const renderCatalogue = (catalogue) => (
  catalogue && catalogue.products
    && catalogue.products.map(renderProduct(catalogue.selected))
)

const useBdux = createUseBdux({
  catalogue: CatalogueStore,
}, [
  CatalogueAction.init,
])

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
