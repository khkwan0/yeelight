import { combineReducers } from 'redux'
import devicesReducer from './devicesReducer'

export default combineReducers(({
  deviceData: devicesReducer
}))