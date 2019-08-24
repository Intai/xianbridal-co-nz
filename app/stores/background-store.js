import {
  assocPath,
  converge,
  identity,
  path,
  pathEq,
  prop,
  when,
} from 'ramda'
import Bacon from 'baconjs'
import ActionTypes from '../actions/action-types'
import StoreNames from '../stores/store-names'
import { createStore } from 'bdux'

const isAction = pathEq(
  ['action', 'type']
)

const whenSelect = when(
  isAction(ActionTypes.BACKGROUND_SELECT),
  converge(assocPath(['state', 'selected']), [
    path(['action', 'category']),
    identity
  ])
)

export const getReducer = () => {
  const reducerStream = new Bacon.Bus()
  return {
    input: reducerStream,
    output: reducerStream
      .map(whenSelect)
      .map(prop('state'))
  }
}

export default createStore(
  StoreNames.BACKGROUND, getReducer
)
