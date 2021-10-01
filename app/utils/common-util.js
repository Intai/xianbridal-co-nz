import { once, reduce } from 'ramda'

const PREFIX = 'XIAN'

const mapToKeyValue = (obj, key) => {
  obj[key] = PREFIX + '_' + key
  return obj
}

export const canUseDOM = () => (
  typeof window !== 'undefined'
    && window.document
    && window.document.createElement
)

const canUseDOMOnce = once(canUseDOM)

const getEnv = () => (
  canUseDOMOnce()
    ? window.env
    : process.env
) || {}

export const getImageUrl = (pathname) => {
  const cdn = getEnv().IMAGES_CDN_DOMAIN
  return cdn
    ? `${cdn}${pathname}`
    : `/static/images${pathname}`
}

export default {
  canUseDOM: canUseDOMOnce,

  // map an array of strings to
  // object keys and prefixed values.
  createObjOfConsts: reduce(
    mapToKeyValue, {},
  ),
}
