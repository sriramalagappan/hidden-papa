import React, { useEffect } from 'react';
import { View, ImageBackground } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';

const image = require('../../assets/Background.png');

const Page = () => {
    
    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>

            </ImageBackground>
        </View>
    );}

export default Page