/**********************************************************************;
* Project           : Hidden Papa
*
* Author            : Sriram V Alagappan
*
* Date created      : 04/01/2021
*
* Purpose           : Party Game: 20 questions with an imposter
*
***********************************************************************/

import 'react-native-gesture-handler';
import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import MainNavigator from './navigation/MainNavigator';

// fetch fonts from the assets folder
const fetchFonts = () => {
  return Font.loadAsync({
    'regular': require('./assets/fonts/regular.otf'),
    'bold': require('./assets/fonts/bold.otf'),
    'light': require('./assets/fonts/light.otf'),
    'thin': require('./assets/fonts/thin.otf')
  });
};


export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }
  return (
    <MainNavigator />
  )
}
