import React, { useEffect } from 'react';
import { View, ImageBackground } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import * as avatarActions from '../../store/actions/avatar';
import { useDispatch } from 'react-redux'
import { CommonActions } from '@react-navigation/native';

const image = require('../../assets/HiddenPapaIntro.png')

const IntroPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // componentDidMount
    useEffect(() => {
        const checkAvatar = async () => {
            await avatarActions.checkAvatar();
            // await dispatch(avatarActions.getAvatar());
        };
        checkAvatar();
    }, [])

    const startHandler = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Home' }
                ]
            })
        )
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.background}>
                <View style={styles.buttonContainer}>
                    <Button onPress={startHandler}>Start</Button>
                </View>
            </ImageBackground>
        </View>
    );
};

export default IntroPage;