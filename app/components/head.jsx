import React from 'react'
import { createUseBdux, useBdux } from 'bdux/hook'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Switch,
  Route,
} from 'bdux-react-router'
import CatalogueStore from '../stores/catalogue-store'
import { canUseDOM, encodeSku } from '../utils/common-util'

const renderHead = ({ description, keywords, title }) => {
  if (canUseDOM()) {
    document.title = title
    return false
  }

  return (
    <>
      <meta
        content={description}
        name="description"
      />
      <meta
        content={keywords}
        name="keywords"
      />
      <title>
        {title}
      </title>
    </>
  )
}

const HeadSearchResult = (props) => {
  const { match: { params: { query } } } = props
  const { state } = useBdux(props, { catalogue: CatalogueStore })
  const { catalogue } = state
  const product = catalogue?.selected

  if (!query) {
    return false
  }
  if (product) {
    return <HeadProduct {...props} />
  }
  return renderHead({
    description: `Search result for "${query}" in Wedding Gowns, Sample Sales and Bridal Accessories`,
    keywords: `Wedding,Dress,Gown,Veil,Tiara,${query}`,
    title: `Xian Bridal: Search result for "${query}"`,
  })
}

const categoryDescriptions = {
  gowns: 'Wedding Gowns',
  sales: 'Sample Sales',
  accessories: 'Bridal Accessories',
}

const HeadProduct = (props) => {
  const { state } = useBdux(props, { catalogue: CatalogueStore })
  const { catalogue } = state
  const product = catalogue?.selected

  if (!product) {
    return false
  }
  const sku = encodeSku(product.id)
  const category = categoryDescriptions[product.category]
  return renderHead({
    description: `Photos and details of ${category} #${sku}. ${product.description}`,
    keywords: `#${sku},${product.keywords || ''}`,
    title: `Xian Bridal: ${category} #${sku}`,
  })
}

const HeadCategory = (props) => {
  const { match: { params: { category } } } = props
  const description = categoryDescriptions[category]

  if (!description) {
    return false
  }
  if (category === 'accessories') {
    return renderHead({
      description: 'Bridal Accessories in Auckland. Veils and Tiaras',
      keywords: 'Wedding,Accessories,Veil,Tiara',
      title: `Xian Bridal: ${description}`,
    })
  }
  return renderHead({
    description: 'Wedding Gowns in Auckland. Bridesmaid Dresses, Flower Girl Dresses and Ball Gowns',
    keywords: 'Wedding,Dress,Gown,Auckland,New Zealand,Bridesmaid,Flower Girl',
    title: `Xian Bridal: ${description}`,
  })
}

const HeadHome = () => (
  renderHead({
    description: 'Wedding Gowns in Auckland. Bridesmaid Dresses, Flower Girl Dresses, Ball Gowns, Bridal Accessories, Veils and Tiaras',
    keywords: 'Wedding,Dress,Gown,Auckland,New Zealand,Bridesmaid,Flower Girl,Accessories,Veil,Tiara',
    title: 'Xian Bridal: Wedding Dresses Auckland. Bridesmaid, Flower Girl',
  })
)

const shouldUpdateHead = ({ isStandAlone }) => (
  isStandAlone || canUseDOM()
)

const useBduxHead = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

const Head = (props) => {
  const { state } = useBduxHead(props)
  const { location } = state

  return shouldUpdateHead(props) && (
    <Router history={createLocationHistory(location)}>
      <Switch>
        <Route
          component={HeadProduct}
          path="/search/:query/:id"
        />
        <Route
          component={HeadSearchResult}
          path="/search/:query"
        />
        <Route
          component={HeadProduct}
          path="/:category/:id"
        />
        <Route
          component={HeadCategory}
          path="/:category"
        />
        <Route
          component={HeadHome}
          path="/"
        />
      </Switch>
    </Router>
  )
}

export default Head
