import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, FlatList, Text } from 'react-native';
import styles from './styles';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Button from '../../components/Button';
import Background from '../../components/Background';

const GMWaitPage = (props) => {

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
    useEffect(() => {
        const isEveryoneReady = () => {
            for (let i = 0; i < users.length; ++i) {
                if (!users[i].isReady && users[i].username !== me) return false;
            }
            return true;
        }

        const gameStart = async () => {
            await api.startGame(roomCode);
        }

        // if everyone is ready, setup game and route all users to game screen
        if (users && users.length && me && isEveryoneReady()) {
            setIsLoading(true)
            try {
                gameStart();
            } catch (err) {
                setIsLoading(false)
            }
        }
    }, [users, me])

    useEffect(() => {
        if (settings) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'GMGame' }
                    ]
                })
            )
        }
    }, [settings])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && users.length && wordChoices.length) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, wordChoices])

    const selectWord = async (word) => {
        setIsLoading2(true);
        await api.selectWord(roomCode, word);
        setIsLoading2(false);
    }

    const renderWord = (itemData) => (
        <View key={itemData.item} style={styles.wordContainer}>
            <Button onPress={() => { selectWord(itemData.item) }} isLoading={isLoading2}>
                <Text>{itemData.item}</Text>
            </Button>
        </View>
    )

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
                    <Text style={styles.revealText}>You are the Game Master</Text>
                    <Text style={styles.smallText}>Word: {word}</Text>
                    <Text style={styles.smallTextMargin}>You may now reveal yourself</Text>
                    <Text style={styles.smallText}>Waiting for everyone else to be ready...</Text>
                </Background>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <Text style={styles.roleText}>You are the Game Master</Text>
                <Text style={styles.subtitle}>Select a word</Text>
                <View style={styles.listContainer}>
                    <FlatList
                        data={wordChoices}
                        renderItem={renderWord}
                        keyExtractor={(word, index) => index.toString()}
                        numColumns={1}
                        scrollEnabled={true}
                    />
                </View>
            </Background>
        </View>
    );
}

export default GMWaitPage