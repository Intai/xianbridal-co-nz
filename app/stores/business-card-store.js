import {
  assocPath,
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

const whenExpand = when(
  isAction(ActionTypes.BUSINESS_CARD_EXPAND),
  assocPath(['state', 'isCompact'], false)
)

const whenShrink = when(
  isAction(ActionTypes.BUSINESS_CARD_SHRINK),
  assocPath(['state', 'isCompact'], true)
)

export const getReducer = () => {
  const reducerStream = new Bacon.Bus()
  return {
    input: reducerStream,
    output: reducerStream
      .map(whenExpand)
      .map(whenShrink)
      .map(prop('state'))
  }
}

export default createStore(
  StoreNames.BUSINESS_CARD, getReducer
)
