import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroPage from '../pages/IntroPage/IntroPage';
import HomePage from '../pages/HomePage/HomePage';
import AvatarPage from '../pages/AvatarPage/AvatarPage';
import colors from '../theme/colors'
import { Ionicons } from '@expo/vector-icons';


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
                <Stack.Screen
                    name="Avatar"
                    component={AvatarPage}
                    options={{
                        headerShown: true,
                        headerTitle: 'Customize Your Avatar',
                        headerStyle: {
                            backgroundColor: colors.primary,
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 18,
                            fontFamily: 'bold'
                        },
                        headerBackTitleStyle: {
                            // Don't display for now 
                            color: colors.primary,
                            fontSize: 16,
                            fontFamily: 'thin' 
                        },
                        headerBackImage: () => (<Ionicons name={'chevron-back'} size={30} color="black" />),
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