import React from 'react'
import HomePage from './src/screens/HomePage'
import Stacknavi from './src/navigations/Stacknavi'
import { CodeContextProvider } from './src/components/CodeConfirmContext'
import StyledBottom from './src/navigations/BottomNavi'

import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <CodeContextProvider>
   <NavigationContainer>
        <Stacknavi />
      </NavigationContainer>
    </CodeContextProvider>

  )
}

export default App