import * as TYPES from '../types/types'

const INITIAL_STATE = {
  groups: {},
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.SET_GROUP:
      return {
        ...state,
        groups: action.payload
      }
    default: return state
  }
}