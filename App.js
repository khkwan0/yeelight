import 'react-native-gesture-handler'
import React from 'react'
import Main from './src/screens/Main'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/redux/reducers'
import ReduxThunk from 'redux-thunk'
import {Provider as PaperProvider} from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

const store = createStore(rootReducer, {}, applyMiddleware(ReduxThunk))

const App = () => {
  return(
    <Provider store={store}>
      <NavigationContainer>
        <PaperProvider>
          <Main />
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  )
}

export default App