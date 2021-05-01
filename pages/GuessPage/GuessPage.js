import React, { useEffect, useState, useReducer } from 'react';
import { View, ActivityIndicator, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import styles from './styles';
import Background from '../../components/Background';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import CountDown from 'react-native-countdown-component';
import Input from '../../components/Input';

const width = Dimensions.get('window').width;

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
    const [endCounter, setEndCounter] = useState(null);
    const [countersSet, setCounterSet] = useState(false);
    const [guess, setGuess] = useState('')

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

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

    // Update Game State for listener function
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

        setCounterSet(false)
    }, [users]);

    useEffect(() => {
        if (settings && !countersSet) {
            setCounterSet(true);

            const lag = settings.startTime - Date.now();

            if (lag > 0) {
                setStartCounter(lag);
                const delay = 6000 - lag
                // set in seconds since thats what the countdown component wants
                setEndCounter(Math.floor( ((settings.endTime - Date.now()) + delay)/ 1000));
            } else {
                setStartCounter(0);
                let gameTimeRemaining = Math.floor((6000 + settings.endTime - Date.now())/ 1000);
                gameTimeRemaining = (gameTimeRemaining > 0) ? gameTimeRemaining : 0;
                setEndCounter(gameTimeRemaining);
            }

            forceUpdate();
        }
    }, [settings]);

    useEffect(() => {
        if (startCounter) {
            startCounter > 0 && setTimeout(() => setStartCounter(startCounter - 1000), 1000);
        }
    }, [startCounter]);

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && users.length && word && gameData && settings && myPlayer) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [roomCode, users, gameData, settings, startCounter, myPlayer]);

    const updateGuess = (input) => {
        setGuess(input)
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

    if (startCounter && Math.floor(startCounter / 1000) > 0) {
        return (
            <View style={styles.container}>
                <Background justify={true}>
                    <Text style={styles.countdown}>{Math.floor(startCounter / 1000)}</Text>
                </Background>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <TouchableOpacity style={styles.screen} onPress={() => { Keyboard.dismiss() }} activeOpacity={1}>
                    <View style={styles.countdownContainer}>
                        <CountDown
                            until={endCounter}
                            size={width * .08}
                            onFinish={() => { }}
                            digitStyle={styles.digitStyle}
                            digitTxtStyle={styles.digitTextStyle}
                            timeToShow={['M', 'S']}
                            timeLabels={{ m: null, s: null }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Input
                            onChangeText={updateGuess}
                            value={guess}
                            placeholder={(myPlayer.role === 'hidden-papa') ? word : "Enter a guess"}
                            keyboardType={"default"}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            maxLength={20}
                            multiline={false}
                            numberOfLines={1}
                            textAlign={"center"}
                        />
                    </View>
                </TouchableOpacity>
            </Background>
        </View>
    );
}

export default GuessPage