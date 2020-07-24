import React from 'react'
import { Image } from 'react-native'

const ColorPicker = (props) => {
  let initColor = '#ffffff'
  if (typeof props.initColor !== 'undefined') {
    initColor = props.initColor
  }
  return(
    <Image
      source={require('../../assets/color-wheel.png')}
    />
  )
}

export default ColorPicker