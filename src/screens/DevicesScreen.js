import React from 'react'
import DeviceList from './components/DeviceList'
import { useSelector } from 'react-redux'
import {View, Text} from 'react-native'

const DevicesScreen = props => {

  const devices = useSelector(_state=>_state)

  return(
    <View style={{}}><DeviceList devices={devices} /></View>
  )
}

export default DevicesScreen