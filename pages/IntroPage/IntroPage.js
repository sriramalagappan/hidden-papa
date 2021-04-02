import React from 'react';
import { View, ImageBackground } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import Button from '../../components/Button'

const image = require('../../assets/HiddenPapaIntro.png')
const backgroundImage = require('../../assets/Background.png')

const IntroPage = (props) => {

    const startHandler = () => {
        props.navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={{ width: 0, height: 0 }} />
            <ImageBackground source={image} style={ImageStyles.background}>
                <View style={styles.buttonContainer}>
                    <Button onPress={startHandler}>Start</Button>
                </View>
            </ImageBackground>
        </View>
    );
};

export default IntroPage;