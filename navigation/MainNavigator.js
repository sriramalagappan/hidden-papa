import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroPage from '../pages/IntroPage/IntroPage';
import HomePage from '../pages/HomePage/HomePage';
import colors from '../theme/colors'

const MainNavigator = () => {

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Intro"
                    component={IntroPage}
                    options={{
                        headerShown: false,
                        cardStyle: {
                            backgroundColor: colors.primary,
                            opacity: 1,
                        }
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={{
                        headerShown: false,
                        cardStyle: {
                            backgroundColor: colors.primary,
                            opacity: 1,
                        }
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigator