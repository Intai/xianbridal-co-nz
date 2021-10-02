import { identity, memoizeWith, once, reduce } from 'ramda'
import md5 from 'blueimp-md5'

const PREFIX = 'XIAN'

const mapToKeyValue = (obj, key) => {
  obj[key] = PREFIX + '_' + key
  return obj
}

export const canUseDOM = once(() => (
  typeof window !== 'undefined'
    && window.document
    && window.document.createElement
))

const getEnv = () => (
  canUseDOM()
    ? window.env
    : process.env
) || {}

export const getImageUrl = (pathname) => {
  const cdn = getEnv().IMAGES_CDN_DOMAIN
  return cdn
    ? `${cdn}${pathname}`
    : `/static/images${pathname}`
}

export const getWebUrl = (pathname) => {
  const cdn = getEnv().WEB_CDN_DOMAIN
  return cdn
    ? `${cdn}${pathname}`
    : pathname
}

export const encodeSku = memoizeWith(identity, (name) => (
  `${md5(name).slice(0, 3).toUpperCase()}${name}`
))

export const decodeSku = (code) => (
  code && code.slice(3)
)

export default {
  canUseDOM,

  // map an array of strings to
  // object keys and prefixed values.
  createObjOfConsts: reduce(
    mapToKeyValue, {},
  ),
}
