import React from 'react'
import { useParams } from 'react-router'
import { createUseBdux, useBdux } from 'bdux/hook'
import {
  LocationAction,
  LocationStore,
  Router,
  Routes,
  Route,
  updateRouterLocation,
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
  const { query } = useParams()
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

const HeadCategory = () => {
  const { category } = useParams()
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
    <Router location={updateRouterLocation(location)}>
      <Routes>
        <Route path="/search/:query">
          <Route
            element={<HeadProduct />}
            path=":id"
          />
          <Route
            element={<HeadSearchResult />}
            index
          />
        </Route>

        <Route path="/:category">
          <Route
            element={<HeadProduct />}
            path=":id"
          />
          <Route
            element={<HeadCategory />}
            index
          />
        </Route>

        <Route
          element={<HeadHome />}
          path="/"
        />
      </Routes>
    </Router>
  )
}

export default Head
