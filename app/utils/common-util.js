import { once, reduce } from 'ramda';

const PREFIX = 'XIAN';

const mapToKeyValue = (obj, key) => {
  obj[key] = PREFIX + '_' + key;
  return obj
}

export const canUseDOM = () => (
  typeof window !== 'undefined'
    && window.document
    && window.document.createElement
)

export default {
  canUseDOM: once(canUseDOM),

  // map an array of strings to
  // object keys and prefixed values.
  createObjOfConsts: reduce(
    mapToKeyValue, {}
  )
}
