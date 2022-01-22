import React, { useEffect, useState, useReducer } from 'react';
import { View, ActivityIndicator, Text, Dimensions, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import styles from './styles';
import Background from '../../components/Background';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import CountDown from 'react-native-countdown-component';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Button from '../../components/Button';
import SmallButton from '../../components/SmallButton';
import BigHead from '../../components/BigHead';
import colors from '../../theme/colors';
import { CommonActions } from '@react-navigation/native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const VotingPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const me = useSelector(state => state.room.me);
    const users = useSelector(state => state.room.users);
    const roomData = useSelector(state => state.room.roomData);
    const gameData = useSelector(state => state.room.gameData);
    const settings = useSelector(state => state.room.gameData.settings);
    const voteSettings = useSelector(state => state.room.gameData.voting);
    const resultsSettings = useSelector(state => state.room.gameData.results);

    const word = (gameData && gameData.words) ? gameData.words.word : '';

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [myPlayer, setMyPlayer] = useState(null);
    const [startCounter, setStartCounter] = useState(null);
    const [endCounter, setEndCounter] = useState(null);
    const [countersSet, setCounterSet] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [displayGuesses, toggleGuesses] = useState(false);
    const [guessesSet, setGuessesSet] = useState(false);
    const [resultsGenerated, setResultsGenerates] = useState(false);
    const [nav, setNav] = useState(false);

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

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

    useEffect(async () => {
        if (users && users.length) {
            // only set guesses and player model once
            if (!guessesSet) {
                // get my player model
                let temp = null;
                // get list of guesses
                let guessList = [];

                for (let i = 0; i < users.length; ++i) {
                    if (users[i].username === me) temp = users[i];

                    if (users[i].guesses && users[i].guesses.length) {
                        for (let j = 0; j < users[i].guesses.length; ++j) {
                            guessList.push({ avatar: users[i].avatar, username: users[i].username, ...users[i].guesses[j] });
                        }
                    }
                }
                setMyPlayer(temp);
                guessList.sort(function (a, b) {
                    return b.time - a.time;
                });
                setGuesses(guessList.slice());
                setGuessesSet(true);
            } else {
                // count num votes
                let numVotes = 0;

                for (let i = 0; i < users.length; ++i) {
                    if (users[i].vote) numVotes++;
                }

                // if everyone has voted, generate results
                if (numVotes === users.length && myPlayer.isHost) {
                    await generateResults();
                }
            }
        }
    }, [users]);

    useEffect(() => {
        if (voteSettings && !countersSet) {
            setCounterSet(true);

            const lag = voteSettings.startTime - Date.now();

            if (lag > 0) {
                setStartCounter(lag);
                const delay = 6000 - lag
                // set in seconds since thats what the countdown component wants
                setEndCounter(Math.floor(((voteSettings.endTime - Date.now()) + delay) / 1000));
            } else {
                setStartCounter(0);
                let gameTimeRemaining = Math.floor((6000 + voteSettings.endTime - Date.now()) / 1000);
                gameTimeRemaining = (gameTimeRemaining > 0) ? gameTimeRemaining : 0;
                setEndCounter(gameTimeRemaining);
            }

            forceUpdate();
        }
    }, [voteSettings]);

    useEffect(() => {
        if (startCounter) {
            startCounter > 0 && setTimeout(() => setStartCounter(startCounter - 1000), 1000);
        }
    }, [startCounter]);

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && users.length && word && gameData && settings && myPlayer && endCounter) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [roomCode, users, gameData, settings, startCounter, myPlayer]);

    useEffect(() => {
        // see if results have been generated
        if (resultsSettings && resultsSettings.hiddenPapa && !nav) {
            // navigate to results page
            setNav(true);
            setIsLoading(true);
            
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Results' }
                    ]
                })
            )
        }
    }, [resultsSettings])


    const makeVote = async (player) => {
        if (myPlayer) {
            const newData = { ...myPlayer };
            newData.vote = player
            await api.updateUser(roomCode, me, newData);
            closeHandler();
        }
    }

    /**
    * handler when user touches outside of modal
    */
    const closeHandler = () => {
        setVisible(false);
        setModalType('');
    }

    const settingsModal = () => {
        setModalType('settings');
        setVisible(true);
    }

    const voteModal = (player) => {
        if (myPlayer.vote) {
            Alert.alert(
                "Voting Error",
                "You have already voted",
                [
                    { text: "OK" }
                ]
            );
        } else {
            setModalType('voteConfirm');
            setModalData(player);
            setVisible(true);
        }
    }

    const guessesModal = async () => {
        toggleGuesses(!displayGuesses);
    }

    // Host needs to end game once timer runs out
    const onFinishHandler = async () => {
        if (myPlayer.isHost) {
            setTimeout(async function() {
                console.log('Delay done');
                setIsLoading(true);
                await generateResults();
            }, 3000); // pad 3 seconds
        }
    }

    const generateResults = async () => {
        if (!resultsGenerated) {
            setResultsGenerates(true);
            await api.generateResults(roomCode, word);
        }
    }

    const renderPlayer = (itemData) => (
        <View key={itemData.item.username} style={styles.player}>
            <TouchableOpacity onPress={() => { voteModal(itemData.item) }}>
                {itemData.item.vote ?
                    (<Ionicons style={styles.readyIcon} name={'checkmark-circle'} size={25} color={colors.green} />)
                    : (<View />)
                }
                <BigHead avatar={itemData.item.avatar} size={width * .23} />
                <Text style={styles.playerText}>{itemData.item.username}</Text>
            </TouchableOpacity>
        </View>
    )

    const renderGuess = (itemData) => (
        <View key={itemData.item.time} style={styles.guessContainer}>
            {/* <BigHead avatar={itemData.item.avatar} size={width * .1} /> */}
            <Text style={styles.guessText}>{itemData.item.username} guessed <Text style={styles.guessTextWord}>{itemData.item.guess}</Text></Text>
        </View>
    )

    const ModalComponent = () => {
        switch (modalType) {
            case 'settings': {
                return (
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
                        <TouchableOpacity style={styles.modal} activeOpacity={1}>
                            <View style={styles.modalBody}>
                                <Button>Return to Home</Button>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
            case 'voteConfirm': {
                if (!modalData) return (<View />)

                return (
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
                        <TouchableOpacity style={styles.modal} activeOpacity={1}>
                            <View style={styles.modalBody}>
                                <Text style={styles.modalTitle}>Are you sure you want to vote for {modalData.username}?</Text>
                                <View style={styles.row}>
                                    <SmallButton onPress={closeHandler}>No</SmallButton>
                                    <SmallButton onPress={() => { makeVote(modalData.username) }}>Yes</SmallButton>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
            default: {
                return (
                    <View />
                )
            }
        }
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

                <Modal
                    visible={visible}
                    transparent={true}
                    onRequestClose={closeHandler}
                    animationType={'fade'}
                >
                    <ModalComponent />
                </Modal>


                <View style={styles.settingsContainer}>
                    <TouchableOpacity onPress={settingsModal}>
                        <Ionicons name={'settings'} size={40} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.guessesIconContainer}>
                    <TouchableOpacity onPress={guessesModal}>
                        <FontAwesome5 name={'history'} size={36} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.countdownContainer}>
                    <CountDown
                        until={endCounter}
                        size={width * .1}
                        onFinish={() => { onFinishHandler() }}
                        digitStyle={styles.digitStyle}
                        digitTxtStyle={styles.digitTextStyle}
                        timeToShow={['M', 'S']}
                        timeLabels={{ m: null, s: null }}
                    />
                </View>
                    
                <View style={styles.bodyContainer}>
                    <View style={styles.playersContainer}>
                        <FlatList
                            data={users}
                            renderItem={renderPlayer}
                            keyExtractor={(user, index) => index.toString()}
                            numColumns={4}
                            scrollEnabled={false}
                        />
                    </View>
                </View >
                    
                {(displayGuesses) ?
                    (<View style={styles.guessesListContainer}>
                        <FlatList
                            data={guesses}
                            renderItem={renderGuess}
                            keyExtractor={(user, index) => index.toString()}
                            numColumns={1}
                        />
                    </View>)
                    : (<View />)
                }
            </Background>
        </View>
    );
}

export default VotingPage