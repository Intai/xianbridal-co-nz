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
import { canUseDOM, getImageUrl, getOrigin, encodeSku } from '../utils/common-util'
import {
  BRAND,
  getName,
  getCategory,
  getDescription,
  getMainImageUrl,
  getAdditionalImageUrls,
  getProductUrl,
  isSold,
} from '../utils/product-util'

const DEFAULT_IMAGE = '/background/gowns2.webp'

// json-ld is embedded in a script tag, so a literal `<` in any
// value could close it early.
const serialiseJsonLd = (graph) => (
  JSON.stringify(graph).replace(/</g, '\\u003c')
)

const renderJsonLd = (graph) => (
  <script
    dangerouslySetInnerHTML={{ __html: serialiseJsonLd(graph) }}
    type="application/ld+json"
  />
)

const renderHead = ({
  canonical,
  description,
  image,
  jsonLd,
  keywords,
  noindex,
  title,
  type = 'website',
  url,
}) => {
  if (canUseDOM()) {
    document.title = title
    return false
  }

  const imageUrl = getImageUrl(image || DEFAULT_IMAGE)
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
      {noindex && (
        <meta
          content="noindex,follow"
          name="robots"
        />
      )}
      <meta
        content={title}
        property="og:title"
      />
      <meta
        content={description}
        property="og:description"
      />
      <meta
        content={imageUrl}
        property="og:image"
      />
      <meta
        content={type}
        property="og:type"
      />
      {!!url && (
        <meta
          content={url}
          property="og:url"
        />
      )}
      <meta
        content={title}
        name="twitter:title"
      />
      <meta
        content={description}
        name="twitter:description"
      />
      <meta
        content={imageUrl}
        name="twitter:image"
      />
      {!!canonical && (
        <link
          href={canonical}
          rel="canonical"
        />
      )}
      <title>
        {title}
      </title>
      {!!jsonLd && renderJsonLd(jsonLd)}
    </>
  )
}

const categoryDescriptions = {
  gowns: 'Wedding Gowns',
  sales: 'Sample Sales',
  accessories: 'Bridal Accessories',
}

const getOffer = (product) => (
  product.price
    ? {
      offers: {
        '@type': 'Offer',
        url: getProductUrl(product),
        priceCurrency: 'NZD',
        price: product.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: isSold(product)
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: BRAND,
        },
      },
    }
    // a product without an offer is still valid schema.org.
    : {}
)

const getProductJsonLd = (product) => {
  const url = getProductUrl(product)
  const origin = getOrigin()

  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Product',
      '@id': `${url}#product`,
      name: getName(product),
      description: getDescription(product),
      sku: encodeSku(product.id),
      mpn: encodeSku(product.id),
      image: [
        getMainImageUrl(product),
        ...getAdditionalImageUrls(product),
      ],
      brand: {
        '@type': 'Brand',
        name: BRAND,
      },
      category: getCategory(product),
      url,
      ...getOffer(product),
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [{
        '@type': 'ListItem',
        position: 1,
        name: BRAND,
        item: origin,
      }, {
        '@type': 'ListItem',
        position: 2,
        name: categoryDescriptions[product.category],
        item: `${origin}/${product.category}`,
      }, {
        // the current page omits item.
        '@type': 'ListItem',
        position: 3,
        name: getName(product),
      }],
    }],
  }
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
  // search results deep link to the same product, so both routes
  // canonicalise to the category url.
  const canonical = getProductUrl(product)
  return renderHead({
    canonical,
    description: getDescription(product),
    image: `/product/${product.id}-500.webp`,
    jsonLd: getProductJsonLd(product),
    keywords: `#${sku}`,
    title: `Xian Bridal: ${category} #${sku}`,
    type: 'product',
    url: canonical,
  })
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
    noindex: true,
    title: `Xian Bridal: Search result for "${query}"`,
  })
}

const HeadCategory = () => {
  const { category } = useParams()
  const description = categoryDescriptions[category]

  if (!description) {
    return false
  }
  const canonical = `${getOrigin()}/${category}`
  if (category === 'accessories') {
    return renderHead({
      canonical,
      description: 'Bridal Accessories in Auckland. Veils and Tiaras',
      keywords: 'Wedding,Accessories,Veil,Tiara',
      title: `Xian Bridal: ${description}`,
      url: canonical,
    })
  }
  return renderHead({
    canonical,
    description: 'Wedding Gowns in Auckland. Bridesmaid Dresses, Flower Girl Dresses and Ball Gowns',
    keywords: 'Wedding,Dress,Gown,Auckland,New Zealand,Bridesmaid,Flower Girl',
    title: `Xian Bridal: ${description}`,
    url: canonical,
  })
}

const HeadHome = () => {
  const canonical = getOrigin()
  return renderHead({
    canonical,
    description: 'Wedding Gowns in Auckland. Bridesmaid Dresses, Flower Girl Dresses, Ball Gowns, Bridal Accessories, Veils and Tiaras',
    keywords: 'Wedding,Dress,Gown,Auckland,New Zealand,Bridesmaid,Flower Girl,Accessories,Veil,Tiara',
    title: 'Xian Bridal: Wedding Dresses Auckland. Bridesmaid, Flower Girl',
    url: canonical,
  })
}

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
