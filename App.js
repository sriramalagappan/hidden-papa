import 'react-native-gesture-handler';
import React from 'react';
import PaperTheme from './theme/rnpaper-theme';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  return (
    <PaperProvider theme={PaperTheme}>
        <MainNavigator />
    </PaperProvider>
  );
}
