import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import Background from './Background';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';


const loadingAsset = '../assets/animations/loading.json';

const LoadingComponent = (props) => {

    // Variables
    const [animation, setAnimation] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);
    const [exit, setExit] = useState(false);

    // ensure animation is playing
    useEffect(() => {
        if (animation) {
            animation.reset();
            animation.play();
        }
    }, [animation])

    // componentDidMount
    useEffect(() => {
        id = setTimeout(() => {
            setExit(true);
        }, 5000);

        setTimeoutId(id);

        // componentDidUnmount
        return () => {
            clearTimeout(timeoutId);
        }
    }, [])

    // UI
    return (
        <View style={styles.container}>
            <Background justify={true}>
                {(exit) ?
                    (<View style={styles.back}>
                        <TouchableOpacity onPress={props.backButtonFunction}>
                            <Ionicons name={'chevron-back'} size={40} color="black" />
                        </TouchableOpacity>
                    </View>)
                    : (<View />)
                }
                <View pointerEvents="none">
                    <LottieView
                        ref={ani => { setAnimation(ani); }}
                        style={styles.loading}
                        source={require(loadingAsset)}
                        loop={true}
                        autoPlay={true}
                    />
                </View>
                {(exit) ?
                    (<View style={styles.margin}>
                        <Text style={styles.text}>This is taking longer than expected. {props.text}</Text>
                    </View>)
                    : (<View />)
                }
            </Background>
        </View>
    )
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        width: 175,
        height: 175,
    },
    margin: {
        marginHorizontal: 20,
    },
    text: {
        fontFamily: 'thin',
        fontSize: 17,
        textAlign: 'center'
    },
    back: {
        position: 'absolute',
        top: height * .01,
        left: width * .01,
    },
})

export default LoadingComponent;