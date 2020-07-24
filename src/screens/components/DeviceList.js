import React from 'react'
import { FlatList, View, Text, RefreshControl, StyleSheet, Modal} from 'react-native'
import { Buffer } from 'buffer'
import { useDispatch } from 'react-redux'
import {discoverDevices, executeCommandOnDevice} from '../../redux/actions/deviceActions'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Slider from '@react-native-community/slider'
import { Button } from 'react-native-paper'
import ColorPicker from './ColorPicker'

const DeviceList = props => {

  const dispatch = useDispatch()

  const [loading, setLoading] = React.useState(false)
  const [properties, setProperties] = React.useState({})
  const [tempProperties, setTempProperties] = React.useState({})
  const [showPicker, setShowPicker] = React.useState(false)
  const [chosen, setChosen] = React.useState(-1)
  const [initColor, setInitColor] = React.useState('#ffffff')

  React.useEffect(() => {
    setProperties({...props.devices.deviceData})
    setTempProperties({...props.devices.deviceData})
  }, [props.devices.deviceData])

  React.useEffect(()=> {
    if (chosen > -1) {
      setShowPicker(true)
    }
  }, [chosen])

  const handleDeviceChange = (property, idx, val) => {
    const device = {...tempProperties.devices_array[idx]}
    device[property] = val
    const newProps = {...tempProperties}
    newProps.devices_array[idx] = {...device}
    setTempProperties({...newProps})
  }

  const handleUndo = idx => {
    const device = {...properties.devices_array[idx]}
    const newProps = {...tempProperties}
    newProps.devices_array[idx] = {...device}
    setTempProperties({...newProps})
  }

  const handleSave = idx => {

  }

  const executeDeviceChange = (property, idx, val = null) => {
    const device = tempProperties.devices_array[idx]
    let method = null
    let params = []
    switch(property) {
      case 'bright': method = "set_bright"; params = [val, "smooth", 500];break;
      case 'power_on': method = "set_power"; params = ["on", "smooth", 500];break;
      case 'power_off': method = "set_power"; params = ["off", "smooth", 500];break;
      default: break;
    }
    if (method) {
      const command = {
        id: 1,
        method: method,
        params: params
      }
      const _command = JSON.stringify(command) + "\r\n"
      executeCommandOnDevice(device, _command)
    } else {

    }
  }

  const handleColorChange = (color) => {
    console.log(color)
  }

  const renderDevices = (item) => {
    const idx = item.index
    let {
      ip,
      port,
      name,
      power,
      rgb,
      model,
      bright
    } = item.item
    const b = rgb % 256
    const g = ((rgb-b)/256) % 256
    const r = ((rgb-b)/(256*256)) - (g/256)

    const color_halfa = 'rgba('+r+','+g+','+b+',0.25)'
    const color = 'rgba('+r+','+g+','+b+',1)'
    const bulb_icon = <Icon name={power === 'on'?"lightbulb-on":"lightbulb"} color={color} size={60} />
    if (name.length === 0) {
      name = "NO NAME"
    } else {
      name = Buffer(name, 'base64').toString('ascii')
    }
    return (
      <View style={[styles.device, {backgroundColor: color_halfa}]}>
        <View style={[{flexDirection: 'row'}]}>
          <Button mode="contained" style={{flex: 1, marginLeft:'1%', marginRight:'1%'}} onPress={()=>executeDeviceChange('power_on', idx)}>TURN ON</Button>
          <Button mode="contained" style={{flex: 1, marginLeft:'1%', marginRight: '1%'}} onPress={()=>executeDeviceChange('power_off', idx)}>TURN OFF</Button>
        </View>
        <View style={[{flexDirection:'row', display: 'flex', alignItems:'center'}]}>
          <View style={{flex:1}}>
            <Text style={styles.name}>{name}</Text>
            <Text>Power: {power.toUpperCase()}</Text>
            {bulb_icon}
          </View>
          <View style={{flex: 1}}>
            <Text>{ip}:{port}</Text>
            <Text>RGB: ({r}, {g}, {b})</Text>
            <Text>Model: {model}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text>Brightness: {bright}</Text>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={100}
            value={bright}
            onSlidingComplete={(e)=>{handleDeviceChange('bright', idx, Math.round(e));executeDeviceChange('bright', idx, Math.round(e))}}
          />
        </View>
        <View>
          <Button mode="contained" onPress={() => setChosen(idx)}>Color</Button>
        </View>
        <View style={{flexDirection: 'row', marginTop:'3%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <View style={{width:'30%'}}>
            <Button onPress={()=>handleUndo(idx)}>UNDO</Button>
          </View>
          <View style={{width:'30%'}}>
            <Button onPress={()=>handleSave(idx)}>SAVE</Button>
          </View>
        </View>
      </View>
    )
  }

  const refreshDevices = () => {
    dispatch(discoverDevices())
  }

  if (typeof tempProperties.devices_array !== 'undefined') {
  return(
    <View>
      <Modal
        visible={showPicker}
        onRequestClose={()=>setShowPicker(false)}
      >
        <ColorPicker initColor={initColor} handleColorChange={handleColorChange} />
      </Modal>
      <FlatList
//        data={props.devices.deviceData.devices_array}
        data={tempProperties.devices_array}
        renderItem={renderDevices}
        keyExtractor={(item, idx) => item.ip + idx}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshDevices} />}
      />
    </View>
  )
  } else {
    return (<></>)
  }
}

const styles = StyleSheet.create({
  device: {
   marginTop: 5,
   paddingLeft: '2%', 
   paddingRight: '2%', 
   paddingBottom: '2%', 
   paddingTop: '2%', 
   marginLeft: '2%',
   marginRight: '2%',
   borderRadius: 10
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
export default DeviceList