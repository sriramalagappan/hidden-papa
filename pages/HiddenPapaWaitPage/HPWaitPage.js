import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, FlatList, Text } from 'react-native';
import styles from './styles';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Button from '../../components/Button';
import Background from '../../components/Background';

const HPWaitPage = props => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const me = useSelector(state => state.room.me);
    const users = useSelector(state => state.room.users);
    const gameData = useSelector(state => state.room.gameData);
    const settings = useSelector(state => state.room.gameData.settings);

    const wordChoices = (gameData && gameData.words) ? gameData.words.wordChoices : [];
    const word = (gameData && gameData.words) ? gameData.words.word : '';

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading2, setIsLoading2] = useState(false);
    const [reveal, setReveal] = useState(false);
    const [myPlayer, setMyPlayer] = useState(null);

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
            if (gameListener) gameListener();
        })
    }, [roomCode])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && users.length && wordChoices.length) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [roomCode, users, wordChoices])

    useEffect(() => {
        if (settings) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Guess' }
                    ]
                })
            )
        }
    }, [settings]) 

    // determine if I'm ready
    const isReady = () => {
        return (myPlayer && myPlayer.isReady);
    }

    // tell room / server I'm ready
    const readyHandler = async () => {
        if (!myPlayer) return;
        setIsLoading2(true);
        let newData = myPlayer;
        newData.isReady = true;
        await api.updateUser(roomCode, me, newData);
        setIsLoading2(false);
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Background justify={true}>
                    <ActivityIndicator color={"black"} size={100} />
                </Background>
            </View>
        )
    }

    if (!reveal) {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={1} onPress={() => { setReveal(true) }}>
                    <Background justify={true}>
                        <Text style={styles.revealText}>Tap to reveal your role</Text>
                    </Background>
                </TouchableOpacity>
            </View >
        )
    }

    if (word) {
        return (
            <View style={styles.container}>
                <Background justify={true}>
                    <Text style={styles.roleText}>You are the Hidden Papa</Text>
                    <Text style={styles.smallText}>Word: {word}</Text>
                    {isReady() ?
                        (<Text style={styles.smallTextMargin}>Waiting for everyone else to be ready...</Text>)
                        : (<Button onPress={readyHandler} isLoading={isLoading2}>Ready?</Button>)
                    }
                </Background>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Background justify={true}>
                <Text style={styles.roleText}>You are the Hidden Papa</Text>
                <Text style={styles.smallText}>Waiting for the game master to select a word</Text>
            </Background>
        </View>
    );
}

export default HPWaitPage