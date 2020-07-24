import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch, useSelector } from 'react-redux'
import {discoverDevices} from '../redux/actions/deviceActions'
import DevicesScreen from './DevicesScreen'
import RoomsScreen from './RoomsScreen'
import GroupsScreen from './GroupsScreen'
import {StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const Tab = createBottomTabNavigator()

const Main = () => {

  const dispatch = useDispatch()
  const devices = useSelector(_state=>_state)

  React.useEffect(() => {
    dispatch(discoverDevices())
  },[])

  return(
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName 
          if (route.name === 'Rooms') {
            iconName = 'sofa'
          } else if (route.name === 'Groups') {
            iconName = 'lightbulb-group'
          } else {
            iconName = 'lightbulb'
          }
          return <Icon name={iconName} size={50} color={color} />
        }
      })}
      tabBarOptions={{showLabel: true, activeTintColor: 'white', inactiveBackgroundColor: 'black', activeBackgroundColor: 'purple', style:styles.tab, lazy: true, labelStyle: styles.label}}
    >
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 80,
    height: 80
  },
  tab: {
    height: 80
  },
  label: {
    fontSize: 16
  }
})

export default Main