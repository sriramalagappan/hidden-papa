import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';
import Background from '../../components/Background';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import BigHead from '../../components/BigHead';
import { CommonActions } from '@react-navigation/native';
import LoadingComponent from '../../components/Loading';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ResultsPage = (props) => {

    // #region Variables

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const me = useSelector(state => state.room.me);
    const users = useSelector(state => state.room.users);
    const roomData = useSelector(state => state.room.roomData);
    const gameData = useSelector(state => state.room.gameData);
    const resultsSettings = useSelector(state => state.room.gameData.results);

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [hpAvatar, setHPAvatar] = useState(null);
    const [gameWon, setGameWon] = useState(null);
    const [hiddenPapa, setHiddenPapa] = useState('');
    const [word, setWord] = useState('');

    // #endregion

    // #region Listeners

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

    // #endregion

    // #region useEffects

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

    useEffect(() => {
        if (users && users.length) {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].username === hiddenPapa) setHPAvatar(users[i].avatar);
            }
        }
    }, [users, hiddenPapa]);

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && gameData && resultsSettings && word && hiddenPapa) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [roomCode, gameData, resultsSettings]);

    useEffect(() => {
        if (resultsSettings) {
            setGameWon(resultsSettings.gameWon);
            setHiddenPapa(resultsSettings.hiddenPapa); 
            setWord(resultsSettings.word);
        }
    }, [resultsSettings])

    // #endregion

    // #region Functions

    const buttonHandler = () => {
        // navigate to lobby page
        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Lobby' }
                ]
            })
        );
    }

    // #endregion

    // #region Local Components

    const title = () => {
        if (!resultsSettings) return 'Loading...';
        if (gameWon === 1) {
            // Case 1: Guessers Won
            return (hiddenPapa !== me) ? 'You Won!' : 'You Lost';
        } else if (gameWon === 0) {
            // Case 2: Hidden Papa Won
            return (hiddenPapa === me) ? 'You Won!' : 'You Lost';
        } else {
            // Case 3: Everyone Lost
            return 'You Lost';
        }
    }

    const avatar = () => {
        const newAvatar = hpAvatar;
        if (resultsSettings) {
            newAvatar['mouth'] = (gameWon) ? 'sad' : 'openSmile'
        }

        return newAvatar;
    }

    // #endregion

    // #region UI

    if (isLoading) {
        return (
            <LoadingComponent
                backButtonFunction={buttonHandler}
                text={"Please wait or press the back button to return to the lobby"}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <Text style={styles.title}>{title()}</Text>
                <View style={styles.row}>
                    <View style={styles.text}>
                        <Text style={styles.subtitle}>{'Word: '}<Text style={styles.boldText}>{word}</Text></Text>
                        <Text style={styles.subtitle}>{'Hidden Papa: '}<Text style={styles.boldText}>{hiddenPapa}</Text></Text>
                    </View>
                    <BigHead avatar={avatar()} size={width * .4} />
                </View>

                <View style={styles.buttonContainer}>
                    <Button onPress={buttonHandler}>Lobby</Button>
                </View>
            </Background>
        </View>
    );
}

// #endregion

export default ResultsPage