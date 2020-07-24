import React from 'react'
import { View, Text } from 'react-native'

const GroupsScreen = props => {
  return(
    <View style={{height: '100%'}}>
      <View style={{height:'10%', backgroundColor:'purple', display:'flex', alignItems: 'center', justifyContent:'center'}}>
        <Text style={{color:'white', fontSize: 20, fontWeight: 'bold'}}>Groups</Text>
      </View>
      <View>
      </View>
    </View>
  )
}

export default GroupsScreen