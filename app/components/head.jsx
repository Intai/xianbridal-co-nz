import React from 'react'
import { createUseBdux, useBdux } from 'bdux'
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

const HeadProduct = (props) => {
  const { state } = useBdux(props, { catalogue: CatalogueStore })
  const { catalogue } = state
  const product = catalogue && catalogue.selected

  if (!product) {
    return false
  }
  const sku = encodeSku(product.id)
  return renderHead({
    description: `Photos and details of Wedding Gown Item #${sku}. ${product.description}`,
    keywords: `#${sku},${product.keywords || ''}`,
    title: `Xian Bridal: Wedding Dress Item #${sku}`,
  })
}

const HeadHome = () => (
  renderHead({
    description: 'Wedding Gowns in Auckland. Bridesmaid Dresses, Flower Girl Dresses, Ball Gowns, Bridal Accessories, Veils and Tiaras',
    keywords: 'Wedding,Dress,Gown,Auckland,New Zealand,Bridesmaid,Flower Girl,Accessories,Veils,Tiaras',
    title: 'Wedding Dresses NZ Auckland. Bridesmaid, Flower Girl',
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
          path="/search/:query/:id?"
        />
        <Route
          component={HeadProduct}
          path="/:category/:id?"
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
