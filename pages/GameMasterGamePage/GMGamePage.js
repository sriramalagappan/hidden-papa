import React, { useEffect, useState, useReducer } from 'react';
import { View, ActivityIndicator, Text, Dimensions, Modal, FlatList } from 'react-native';
import styles from './styles';
import Background from '../../components/Background';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import CountDown from 'react-native-countdown-component';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../../components/Button';
import LottieView from 'lottie-react-native';

const width = Dimensions.get('window').width;

const confettiAsset = '../../assets/confetti.json';

const GMGamePage = (props) => {

    // #region Variables

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const me = useSelector(state => state.room.me);
    const users = useSelector(state => state.room.users);
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
    const [showWord, setShowWord] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState(false);
    const [displayGuesses, toggleGuesses] = useState(false);
    const [guesses, setGuesses] = useState([]);
    const [timeoutId, setTimeoutId] = useState(0);
    const [nav, setNav] = useState(false);
    const [animation, setAnimation] = useState(null);
    const [initLoad, setInitLoad] = useState(false);

    const [_, forceUpdate] = useReducer(x => x + 1, 0);

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
            if (!displayGuesses) { playAnimation(); }
        }
    }, [users]);

    useEffect(() => {
        if (settings && !countersSet) {
            setCounterSet(true);

            const lag = settings.startTime - Date.now();

            if (lag > 0) {
                setStartCounter(lag);
                const delay = 6000 - lag
                // set in seconds since thats what the countdown component wants
                setEndCounter(Math.floor(((settings.endTime - Date.now()) + delay) / 1000));
            } else {
                setStartCounter(0);
                let gameTimeRemaining = Math.floor((6000 + settings.endTime - Date.now()) / 1000);
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
        if (roomCode && users && users.length && word && gameData && settings && endCounter && !initLoad) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [roomCode, users, gameData, settings, startCounter]);

    useEffect(() => {
        // see if we are in voting phase
        if (voteSettings && voteSettings.endTime && !nav) {
            // first clear timeout
            clearTimeout(timeoutId);

            setNav(true);
            setInitLoad(true);
            setIsLoading(true);

            // navigate to voting page
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Vote' }
                    ]
                })
            );
        }
    }, [voteSettings])

    useEffect(() => {
        // see if results have been generated
        if (resultsSettings && resultsSettings.hiddenPapa && !nav) {
            setNav(true);
            setInitLoad(true);
            setIsLoading(true);

            // navigate to results page
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Results' }
                    ]
                })
            )
        }
    }, [resultsSettings]);

    // #endregion

    // #region Functions

    /**
    * handler when user touches outside of modal
    */
    const closeHandler = () => {
        setVisible(false)
        setModalType('')
    }

    const settingsModal = () => {
        setModalType('settings');
        setVisible(true);
    }

    const guessesModal = () => {
        toggleGuesses(!displayGuesses);
    }

    // Host needs to end game once timer runs out
    const onFinishHandler = async () => {
        setInitLoad(true);
        setIsLoading(true);
        const id = setTimeout(async function () {
            await api.gameOver(roomCode, word);
        }, 3000); // pad 3 seconds

        setTimeoutId(id);
    }

    // play confetti animation
    const playAnimation = () => {
        if (animation) {
            animation.reset();
            animation.play();
        }
    }

    // #endregion

    // #region Local Components

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
            default: {
                return (
                    <View />
                )
            }
        }
    }

    // #endregion

    // #region UI

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
                    statusBarTranslucent={true}
                >
                    <ModalComponent />
                </Modal>

                {/* <View style={styles.settingsContainer}>
                    <TouchableOpacity onPress={settingsModal}>
                        <Ionicons name={'settings'} size={40} color="black" />
                    </TouchableOpacity>
                </View> */}

                <View style={styles.toggleWordContainer}>
                    <TouchableOpacity onPress={() => { setShowWord(!showWord) }}>
                        {(showWord) ? (<Ionicons name={'radio-button-on'} size={40} color="black" />)
                            : (<Ionicons name={'radio-button-off'} size={40} color="black" />)}
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

                <View style={styles.wordContainer}>
                    {(showWord) ? (<Text style={styles.word}>{word}</Text>)
                        : (<View />)}
                </View>

                <View style={styles.guessesIconContainer}>
                    <TouchableOpacity onPress={guessesModal}>
                        <FontAwesome5 name={'history'} size={34} color="black" />
                    </TouchableOpacity>
                </View>

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
                <View pointerEvents="none">
                    <LottieView
                        pointerEvents="none"
                        ref={ani => { setAnimation(ani); }}
                        style={styles.confetti}
                        source={require(confettiAsset)}
                        loop={false}
                        autoPlay={false}
                    />
                </View>
            </Background>
        </View>
    );

    //#endregion
}

export default GMGamePage