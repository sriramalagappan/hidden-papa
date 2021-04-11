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
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk'
import avatarReducer from './store/reducers/avatar';
import roomReducer from './store/reducers/room';
import { LogBox } from 'react-native';
import _ from 'lodash';

const rootReducer = combineReducers({
  avatar: avatarReducer,
  room: roomReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

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
  LogBox.ignoreLogs(['Setting a timer']);
  const _console = _.clone(console);
  console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
      _console.warn(message);
    }
  };

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
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  )
}
