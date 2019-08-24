import ActionTypes from './action-types'

export const select = (category) => ({
  type: ActionTypes.BACKGROUND_SELECT,
  category,
})
