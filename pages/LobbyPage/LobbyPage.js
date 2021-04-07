import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import BigHead from '../../components/BigHead';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';

const height = Dimensions.get('window').height;

const image = require('../../assets/Background.png')

const LobbyPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const users = useSelector(state => state.room.users);
    const phase = useSelector(state => state.room.users);
    const gameTimeLength = useSelector(state => state.room.users);
    const gameDifficulty = useSelector(state => state.room.users);

    // Update Room State from listener function
    const updateRoomState = (data) => {
        dispatch(roomActions.updateRoomData(data))
    }

    let roomListener;

    // get listener for room on mount (and only if roomCode is given)
    useEffect(() => {
        const getRoomListener = async () => {
            roomListener = api.roomListener(roomCode, updateRoomState)
        }
        if (roomCode) {
            getRoomListener()
        }
    }, [roomCode])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && (users.length) && phase && gameTimeLength && gameDifficulty) {
            setIsLoading(false)
        } 
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, phase, gameTimeLength, gameDifficulty])

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} style={ImageStyles.background}>
                    <ActivityIndicator color={"black"} size={100} />
                </ImageBackground>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
                </ImageBackground>
            </View>
        );
    }
};

export default LobbyPage;