import React from 'react';
import { View, ImageBackground } from 'react-native';
import styles from './styles';
import HomeButtonLarge from '../../components/HomeButtonLarge'
import HomeButtonSmall from '../../components/HomeButtonSmall'
import { ImageStyles } from '../../theme/component-styles';

const image = require('../../assets/Background.png')

const HomePage = () => {

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.background}>
                <View style={styles.margin} />
                <HomeButtonLarge text={"Create a Room"} icon={"create-outline"} onPress={() => { console.log('hi') }} />
                <HomeButtonLarge text={"Join a Room"} icon={"add-outline"} />
                <View style={styles.smallButtonContainer}>
                    <HomeButtonSmall />
                    <HomeButtonSmall text={"About"} icon={"information-circle-outline"} />
                </View>
            </ImageBackground>
        </View>
    );
};

export default HomePage;