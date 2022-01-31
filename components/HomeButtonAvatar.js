import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableNativeFeedback, Platform, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../theme/colors';
import BigHeadComponent from './BigHead';


const HomeButton = (props) => {

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <View style={styles.container}>
            <TouchableCmp style={(Platform.OS === 'android') ? { flex: 1 } : null} onPress={props.onPress}>
                <View style={styles.button}>
                    <View style={styles.icon}>
                        {
                            (props.avatar) ?
                                (
                                    <View style={styles.bigHeadContainer}>
                                        <BigHeadComponent avatar={props.avatar} size={140} />
                                    </View>
                                )
                                : (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color={'black'} size={50} />
                                    </View>
                                )
                        }
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{props.text}</Text>
                    </View>
                </View>
            </TouchableCmp>
        </View>
    );
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary_light,
        width: width * .4,
        height: height * .25,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: width * .025,
    },
    textContainer: {
        marginTop: 20,
    },
    text: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontFamily: 'regular'
    },
    loadingContainer: {
        marginTop: height * .04,
    },
    bigHeadContainer: {
        marginTop: height * .01,
    },
})

export default HomeButton;