import * as TYPES from '../types/types'

const INITIAL_STATE = {
  devices: {},
  devices_array: []
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.ADD_DEVICE: {
      const _devices = {...state.devices}
      if (typeof action.payload.ip !== 'undefined' && action.payload.ip) {
        const _devices = {...state.devices}
        _devices[action.payload.ip] = {...action.payload}
        let i = 0; let found = false;
        const _devices_array = [...state.devices_array]
        while (i < _devices_array.length && ! found) {
          if (_devices_array[i].ip === action.payload.ip) {
            found = true
          } else {
            i++
          }
        }
        if (!found) {
          _devices_array.push({...action.payload})
        } else {
          _devices_array[i] = {...action.payload}
        }
        return {
          ...state,
          devices: _devices,
          devices_array: _devices_array
        }
      }
    };break;
    case TYPES.UPDATE_DEVICE: {
      if (typeof action.payload.ip !== 'undefined' && action.payload.ip && typeof state.devices[action.payload.ip] !== 'undefined') {
        const _device = {...state.devices[action.payload.ip], ...action.payload.params}
        const _devices = state.devices
        _devices[action.payload.ip] = _device
        let i = 0; let found = false;
        while (i < state.devices_array.length && !found) {
          if (state.devices_array[i].ip === action.payload.ip) {
            found = true
          } else {
            i++
          }
        }
        const _devices_array = state.devices_array
        if (found) {
          _devices_array[i] = {..._devices_array[i], ...action.payload.params}
        }
        return {
          ...state,
          devices: {..._devices},
          devices_array: [..._devices_array]
        }
      } else {
        return state
      }
    };break;
    default: return state
  }
}