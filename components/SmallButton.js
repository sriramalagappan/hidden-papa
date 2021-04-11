import React from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableNativeFeedback, Platform, Text, Dimensions, ActivityIndicator } from 'react-native'
import colors from '../theme/colors'

const Button = props => {

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    const buttonContainerStyle = (props.border) ? styles.containerBorder : styles.container

    return (
        <View style={buttonContainerStyle}>
            <TouchableCmp style={(Platform.OS === 'android') ? { flex: 1 } : null} onPress={props.onPress}>
                <View style={{ ...styles.button, ...props.style }}>
                    {props.isLoading ?
                        (
                            <ActivityIndicator color={'black'} size={20} />
                        )
                        : (
                            <Text style={{ ...styles.text, ...props.textStyle }}>
                                {props.children}
                            </Text>
                        )
                    }
                </View>
            </TouchableCmp>
        </View>
    )
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary_light,
        width: width * .2,
        height: height * .06,
        borderRadius: 5,
        justifyContent: 'center',
    },

    container: {
        borderRadius: 5,
        overflow: (Platform.OS === 'android' && Platform.Version >= 21) ? 'hidden' : 'visible',
        marginTop: 20,
        marginHorizontal: 10,
    },

    containerBorder: {
        borderRadius: 5,
        overflow: (Platform.OS === 'android' && Platform.Version >= 21) ? 'hidden' : 'visible',
        marginVertical: 25,
        marginHorizontal: 10,
        borderColor: 'black',
        borderWidth: 1,
    },

    text: {
        textAlign: 'center',
        color: 'black',
        fontSize: 15,
        fontFamily: 'regular'
    }
});

export default Button