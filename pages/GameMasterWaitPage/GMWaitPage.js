import React, { useEffect, useState } from 'react';
import { View, ImageBackground, ActivityIndicator } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

const image = require('../../assets/Background.png');

const GMWaitPage = () => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const me = useSelector(state => state.room.me);
    const users = useSelector(state => state.room.users);

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [myPlayer, setMyPlayer] = useState(null);
    const [wordChoices, setWordChoices] = useState([]);

    // get my player model
    useEffect(() => {
        if (users && users.length) {
            let temp = null
            for (let i = 0; i < users.length; ++i) {
                if (users[i].username === me) temp = users[i];
            }
            setMyPlayer(temp)
        }
    }, [users])

    // determine if everyone else is ready
    const isEveryoneReady = () => {
        for (let i = 0; i < users.length; ++i) {
            if (!users[i].isReady && users[i].username != myPlayer.username) return false;
        }
        return true;
    }

    // Update Room State for listener function
    const updateRoomState = (data) => {
        if (data) {
            dispatch(roomActions.updateRoomData(data));
        }
    }

    // Update Users State for listener function
    const updateUsersState = (data) => {
        if (data) {
            dispatch(roomActions.updateUsersData(data))
        }
    }

    const updateGameState = (data) => {
        if (data) {
            if (data.words) setWordChoices(data.words.wordChoices);
        }
    }

    // get listener for room on mount (and only if roomCode is given)
    useEffect(() => {
        let roomListener = null
        let usersListener = null
        let gameListener = null

        const getListeners = async () => {
            roomListener = await api.roomListener(roomCode, updateRoomState)
            usersListener = await api.usersListener(roomCode, updateUsersState)
            gameListener = await api.gameListener(roomCode, updateGameState)
        }
        if (roomCode) {
            getListeners()
        }

        return (() => {
            // detach room listener
            if (roomListener) roomListener();
            if (usersListener) usersListener();
        })
    }, [roomCode])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && users.length && wordChoices.length) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, wordChoices])


    if (isLoading) {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} style={ImageStyles.background}>
                    <ActivityIndicator color={"black"} size={100} />
                </ImageBackground>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
                
            </ImageBackground>
        </View>
    );
}

export default GMWaitPage