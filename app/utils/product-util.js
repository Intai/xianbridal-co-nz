import { keys } from 'ramda'
import { getEnv, getImageUrl, getOrigin, encodeSku } from './common-util'

export const BRAND = 'Xian Bridal'

// must match the shop code on the business profile exactly,
// which is case sensitive. local listings silently drop
// products whose store code doesn't match a verified store.
export const getStoreCode = () => getEnv().STORE_CODE || 'newlynn'

// google product taxonomy ids.
const CATEGORY_ID_ACCESSORIES = 5443
const CATEGORY_ID_DRESSES = 5329

const CATEGORY_LABELS = {
  gowns: 'Wedding Gown',
  sales: 'Sample Sale Wedding Gown',
  accessories: 'Bridal Accessory',
}

const FEED_TITLE_MAX = 150

export const getMaxWidth = resolutions => {
  const resolution = resolutions[resolutions.length - 1]
  return resolution[0]
}

export const getName = (product, variation) => {
  const suffix = variation ? `-${variation}` : ''
  return product.category === 'accessories'
    ? `Bridal Accessory #${encodeSku(product.id)}${suffix}`
    : `Wedding Dress #${encodeSku(product.id)}${suffix}`
}

export const getCategory = (product) => (
  product.category === 'accessories'
    ? 'Apparel & Accessories > Clothing Accessories > Bridal Accessories'
    : 'Apparel & Accessories > Clothing > Wedding & Bridal Party Dresses > Wedding Dresses'
)

export const getCategoryId = (product) => (
  product.category === 'accessories'
    ? CATEGORY_ID_ACCESSORIES
    : CATEGORY_ID_DRESSES
)

export const getImage = (product, variation = '', width = 500) => getImageUrl(
  `/product/${product.id}${variation && `-${variation}`}-${width}.webp`,
)

export const getSku = (product) => encodeSku(product.id)

export const getProductPath = (product) => (
  `/${product.category}/${getSku(product)}`
)

export const getProductUrl = (product) => (
  `${getOrigin()}${getProductPath(product)}`
)

// overlay doubles as a display badge, so it can hold a price
// string, a single space, or 'Sold'. only the last means anything.
export const isSold = (product) => (
  (product.overlay || '').trim() === 'Sold'
)

// merchant centre requires a price and rejects zero, and
// accessories are deliberately kept out of shopping.
export const isFeedEligible = (product) => (
  product.price > 0 && product.category !== 'accessories'
)

export const getMainImageUrl = (product) => (
  getImage(product, '', getMaxWidth(product.images[0]))
)

export const getAdditionalImageUrls = (product) => (
  keys(product.images)
    .slice(1)
    .map(variation => getImage(
      product,
      variation,
      getMaxWidth(product.images[variation]),
    ))
)

const getDetail = (product) => {
  const detail = (product.description || '').trim()
  // sold products describe themselves as out of stock, which
  // availability already says and which reads badly as a description.
  return /^out of stock$/i.test(detail) ? '' : detail
}

export const getDescription = (product) => {
  const detail = getDetail(product)
  const base = `${CATEGORY_LABELS[product.category]} #${getSku(product)}`
    + ` by ${BRAND}, Auckland New Zealand.`
  return detail
    ? `${base} ${detail}.`
    : base
}

export const getFeedTitle = (product) => {
  const detail = getDetail(product)
  const title = `${BRAND} ${getName(product)}`
  const full = detail
    ? `${title} – ${detail}`
    : title
  return full.length > FEED_TITLE_MAX
    ? full.slice(0, FEED_TITLE_MAX).trim()
    : full
}

// value is the recommended retail price shown struck through.
// merchant wants price at rrp and sale_price at what's charged,
// and rejects a sale price that isn't strictly lower.
export const isOnSale = (product) => product.value > product.price

export const getFeedPrice = (product) => (
  isOnSale(product) ? product.value : product.price
)
