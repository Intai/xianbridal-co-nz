import React from 'react'
import { createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Switch,
  Route,
} from 'bdux-react-router'
import Common from '../utils/common-util'

const renderHead = ({ description, keywords, title }) => {
  if (Common.canUseDOM()) {
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

const HeadProduct = ({ product }) => (
  !!product && renderHead({
    description: `Photos and details of Wedding Gown Item #${product.id}. ${product.description}`,
    keywords: `#${product.id},${product.keywords}`,
    title: `Xian Bridal: Wedding Dress Item #${product.id}`,
  })
)

const HeadHome = () => (
  renderHead({
    description: 'Wedding Gowns in Auckland. Bridesmaid Dresses, Flower Girl Dresses, Ball Gowns, Bridal Accessories, Veils and Tiaras',
    keywords: 'Wedding,Dress,Gown,Auckland,New Zealand,Bridesmaid,Flower Girl,Accessories,Veils,Tiaras',
    title: 'Wedding Dresses NZ Auckland. Bridesmaid, Flower Girl',
  })
)

const shouldUpdateHead = ({ isStandAlone }) => (
  isStandAlone || Common.canUseDOM()
)

const useBdux = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

const Head = (props) => {
  const { state } = useBdux(props)
  const { location } = state

  return !!location && shouldUpdateHead(props) && (
    <Router history={createLocationHistory(location)}>
      <Switch>
        <Route
          component={HeadProduct}
          path="/:id"
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
