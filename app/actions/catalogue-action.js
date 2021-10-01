import {
  both,
  complement,
  either,
  filter,
  find,
  identity,
  memoizeWith,
  propEq,
  propSatisfies,
  test,
} from 'ramda'
import ActionTypes from './action-types'
import database from './database'

const escapeRegex = (value) => (
  (value && typeof value === 'string')
    ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    : ''
)

const filterBySearchQuery = (query) => {
  const escaped = escapeRegex(query)
  const testQuery = both(
    identity,
    test(new RegExp(escaped, 'i')),
  )

  return filter(
    either(
      propSatisfies(testQuery, 'id'),
      propSatisfies(testQuery, 'description'),
    ),
    database,
  )
}

const filterByCategory = memoizeWith(identity, (category) => filter(
  both(
    propEq('category', category),
    complement(propEq('overlay', 'Sold')),
  ),
  database,
))

const findById = memoizeWith(identity, (id) => find(
  propEq('id', id),
  database,
))

export const load = (category, query, id) => {
  let products = []
  let selected = null

  if (category === 'search') {
    products = filterBySearchQuery(query)
    if (id) {
      selected = findById(id)
    } else if (products.length === 1) {
      selected = products[0]
    }
  } else {
    products = filterByCategory(category)
    if (id) {
      selected = findById(id)
    }
  }

  return {
    type: ActionTypes.CATALOGUE_LOAD,
    products,
    selected,
  }
}

export const init = ({ props }) => {
  const { match: { params: { category, id } } } = props
  return load(category, id)
}
