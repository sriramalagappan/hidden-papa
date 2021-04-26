import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Background = (props) => {

    const backgroundStyle = (props.justify) ? styles.background : styles.backgroundNoJustify;

    return (
        <LinearGradient  
            colors={[colors.primary, colors.primary_dark]}
            start={{
                x: 0,
                y: 0
              }}
              end={{
                x: 1,
                y: 1
              }}
            style={backgroundStyle}
        >
            {props.children}
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: width,
        alignItems: 'center',
    },
    backgroundNoJustify: {
        flex: 1,
        resizeMode: 'cover',
        width: width,
        alignItems: 'center',
    }
})

export default Background