import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles';
import Background from '../../components/Background';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

const GuessPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const me = useSelector(state => state.room.me);
    const users = useSelector(state => state.room.users);
    const gameData = useSelector(state => state.room.gameData);
    const settings = useSelector(state => state.room.gameData.settings);

    const word = (gameData && gameData.words) ? gameData.words.word : '';

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [myPlayer, setMyPlayer] = useState(null);
    const [startCounter, setStartCounter] = useState(null);
    const [sCountSet, setSCountSet] = useState(false);

    // TODO: Remove later. Use this to reset game time to current
    const REMOVE = async () => {
        if (roomCode) {
            await api.startGame(roomCode)
        }
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
            dispatch(roomActions.updateUsersData(data));
        }
    }

    const updateGameState = (data) => {
        if (data) {
            dispatch(roomActions.updateGameData(data));
        }
    }

    // get listener for room on mount (and only if roomCode is given)
    useEffect(() => {
        let roomListener = null;
        let usersListener = null;
        let gameListener = null;

        const getListeners = async () => {
            roomListener = await api.roomListener(roomCode, updateRoomState);
            usersListener = await api.usersListener(roomCode, updateUsersState);
            gameListener = await api.gameListener(roomCode, updateGameState);
        }
        if (roomCode) {
            getListeners();
        }

        return (() => {
            // detach room listener
            if (roomListener) roomListener();
            if (usersListener) usersListener();
            if (gameListener) gameListener();
        })
    }, [roomCode]);

    // get my player model
    useEffect(() => {
        if (users && users.length) {
            let temp = null
            for (let i = 0; i < users.length; ++i) {
                if (users[i].username === me) temp = users[i];
            }
            setMyPlayer(temp)
        }

        REMOVE();
        setSCountSet(false)
    }, [users]);

    useEffect(() => {
        if (settings && !sCountSet) {
            setSCountSet(true);
            setStartCounter(Math.floor((settings.startTime - Date.now()) / 1000));
        }
    }, [settings]);

    useEffect(() => {
        if (startCounter) {
            startCounter > 0 && setTimeout(() => setStartCounter(startCounter - 1), 1000);
        }
    }, [startCounter]);

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && users.length && word && gameData && settings) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [roomCode, users, gameData, settings, startCounter]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Background justify={true}>
                    <ActivityIndicator color={"black"} size={100} />
                </Background>
            </View>
        )
    }

    if (startCounter > 0) {
        return (
            <View style={styles.container}>
                <Background justify={true}>
                    <Text style={styles.countdown}>{startCounter}</Text>
                </Background>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Background justify={false}>
            </Background>
        </View>
    );
}

export default GuessPage