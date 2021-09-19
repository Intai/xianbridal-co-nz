import {
  assoc,
  prop,
} from 'ramda'
import * as Bacon from 'baconjs'
import ActionTypes from '../actions/action-types'
import StoreNames from '../stores/store-names'
import { createStore } from 'bdux'

const whenLoad = (params) => {
  if (params.action.type === ActionTypes.CATALOGUE_LOAD) {
    const { action, state } = params
    if (!state || action.products !== state.products
      || action.selected !== state.selected) {
      return assoc('state', {
        products: action.products,
        selected: action.selected,
      }, params)
    }
  }
  return params
}

export const getReducer = () => {
  const reducerStream = new Bacon.Bus()
  return {
    input: reducerStream,
    output: reducerStream
      .map(whenLoad)
      .map(prop('state')),
  }
}

export default createStore(
  StoreNames.CATALOGUE, getReducer,
)
