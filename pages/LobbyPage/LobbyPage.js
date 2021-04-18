import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, ActivityIndicator, TouchableOpacity, Text, FlatList, Modal, Alert } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import SmallButton from '../../components/SmallButton'
import { useDispatch, useSelector } from 'react-redux'
import BigHead from '../../components/BigHead';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ServerLocations from '../../data/ServerLocations';

const width = Dimensions.get('window').width;

const image = require('../../assets/Background.png')

const LobbyPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [myPlayer, setMyPlayer] = useState(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [serverTag, setServerTag] = useState('');
    const [modalData, setModalData] = useState({});

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const users = useSelector(state => state.room.users);
    const phase = useSelector(state => state.room.phase);
    const gameTimeLength = useSelector(state => state.room.gameTimeLength);
    const gameDifficulty = useSelector(state => state.room.gameDifficulty);
    const server = useSelector(state => state.room.server);
    const me = useSelector(state => state.room.me);
    const msg = useSelector(state => state.room.msg);

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

    // get listener for room on mount (and only if roomCode is given)
    useEffect(() => {
        let roomListener = null
        let usersListener = null

        const getListeners = async () => {
            roomListener = await api.roomListener(roomCode, updateRoomState)
            usersListener = await api.usersListener(roomCode, updateUsersState)
        }
        if (roomCode) {
            getListeners()
        }

        return (() => {
            setVisible(false)
            // detach room listener
            if (roomListener) roomListener();
            if (usersListener) usersListener();
        })
    }, [roomCode])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && (users.length) && phase && gameTimeLength && gameDifficulty && msg) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, phase, gameTimeLength, gameDifficulty])

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

    // message handlers
    useEffect(() => {
        if (msg && msg.type) {
            switch (msg.type) {
                case 'roomClosed': {
                    Alert.alert(
                        "Lobby Closed",
                        "This lobby is no longer active. Please create or join a new lobby",
                        [
                            { text: "OK", onPress: () => { routeHome() } }
                        ]
                    )
                }
                case 'kick': {
                    if (msg.to === me) {
                        Alert.alert(
                            "You have been kicked",
                            "The host has kicked you from the lobby.",
                            [
                                { text: "OK", onPress: () => { routeHome() } }
                            ]
                        )
                    }
                }
            }
        }
    }, [msg])

    // get server location text given tag
    useEffect(() => {
        if (server) {
            let temp = '';
            ServerLocations.forEach((location) => {
                if (location.value === server) {
                    temp = location.label
                }
            })
            setServerTag(temp)
        }
    }, [server])

    // determine if I'm host
    const isHost = () => {
        return (myPlayer && myPlayer.isHost);
    }

    // determine if I'm ready
    const isReady = () => {
        return (myPlayer && myPlayer.isReady);
    }

    // (for host) determine if everyone is ready
    const isEveryoneReady = () => {
        if (users.length < 4) return false;
        for (let i = 0; i < users.length; ++i) {
            if (!users[i].isReady && users[i] != myPlayer) return false;
        }
        return true;
    }

    /**
    * handler when user touches outside of modal
    */
    const closeHandler = () => {
        setVisible(false)
        setModalData({})
        setModalType('')
    }

    // send message to server to kick given player
    const kickPlayer = async (player) => {
        if (isHost()) {
            api.kickPlayer(roomCode, player)
            closeHandler()
        }
    }

    /**
     * open modal and display back button warning
     */
    const backButtonHandler = () => {
        Alert.alert(
            "Leaving Lobby",
            "Are you sure you want to leave the lobby? If you are the host, everyone will be removed from the lobby.",
            [
                { text: "Cancel" },
                { text: "OK", onPress: () => { routeHome() } }
            ]
        )
    }

    // route home and close room if host, or remove myself from room if player
    const routeHome = async () => {
        setVisible(false)
        if (isHost()) {
            await api.sendMsg(roomCode, { type: 'roomClosed', to: '' })
        } else {
            await api.removePlayer(roomCode, me)
        }
        props.navigation.navigate('Home')
    }

    // tell room / server I'm ready
    const setReady = async () => {
        let newData = myPlayer
        newData.isReady = !newData.isReady
        await api.updateUser(roomCode, me, newData);
    }

    // open modal for player card
    const openPlayerModel = (player) => {
        setModalType('player')
        setModalData(player)
        setVisible(true)
    }

    // open modal for game settings
    const openGameSettingsModal = () => {
        if (isHost()) setModalType('gameSettingsEdit')
        else setModalType('gameSettingsView')
        setVisible(true)
    }

    // start game by assigning roles to players
    const startGameHandler = async () => {
        await api.gameSetup(roomCode);
    }

    // --------------------------------------------------------------

    const renderPlayer = (itemData) => (
        <View key={itemData.item.username} style={styles.player}>
            <TouchableOpacity onPress={() => { openPlayerModel(itemData.item) }}>
                {itemData.item.isReady ?
                    (<Ionicons style={styles.readyIcon} name={'checkmark-circle'} size={25} color={colors.green} />)
                    : (<View />)
                }
                <BigHead avatar={itemData.item.avatar} size={width * .23} />
                <Text style={styles.playerText}>{itemData.item.username}</Text>
            </TouchableOpacity>
        </View>
    )

    const ModalComponent = () => {
        switch (modalType) {
            // case 'back': {
            //     return (
            //         <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
            //             <TouchableOpacity style={styles.modal} activeOpacity={1}>
            //                 <View style={styles.modalBody}>
            //                     <View style={styles.modalMessageContainer}>
            //                         <Text style={styles.modalMessage}>Are you sure you want to leave the lobby?
            //                         If you are the host, everyone will be removed from the lobby.</Text>
            //                     </View>
            //                     <View style={styles.modalRow}>
            //                         <SmallButton onPress={closeHandler}>No</SmallButton>
            //                         <SmallButton onPress={routeHome}>Yes</SmallButton>
            //                     </View>
            //                 </View>
            //             </TouchableOpacity>
            //         </TouchableOpacity>
            //     )
            // }
            case 'player': {

                const KickButton = (modalData.username !== me && isHost()) ?
                    (<SmallButton
                        style={styles.modalButton}
                        textStyle={styles.kick}
                        onPress={() => { kickPlayer(modalData.username) }}>
                        Kick</SmallButton>)
                    : (<View />);

                return (
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
                        <TouchableOpacity style={styles.modal} activeOpacity={1}>
                            <View style={styles.modalBody}>
                                <Text style={styles.modalPlayerText}>{modalData.username}</Text>
                                <View style={styles.marginLrg} />
                                <View style={styles.modalMessageContainer}>
                                    <Text style={styles.modalMessage}>Games Played: {modalData.gamesPlayed}</Text>
                                    <View style={styles.marginSml} />
                                    <Text style={styles.modalMessage}>Games Won as Guesser: {modalData.gamesWonGuesser}</Text>
                                    <View style={styles.marginSml} />
                                    <Text style={styles.modalMessage}>Games Won as Hidden Papa: {modalData.gamesWonHP}</Text>
                                </View>
                                {KickButton}
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

    // button shows as ready for non-hosts
    // button only displays for host when everyone else is ready
    const GameButton = () => {
        if (isHost()) {

            if (isEveryoneReady()) {
                return (
                    <Button onPress={startGameHandler}>
                        <Text style={styles.isNotReady}>Start Game</Text>
                    </Button>
                )
            } else {
                const msg = (users.length < 4) ? 'Must have at least 4 players to start...' : 'Waiting for everyone to ready up...'
                return (
                    <View style={styles.msgContainer}>
                        <Text style={styles.isNotReady}>{msg}</Text>
                    </View>
                )
            }
        } else {
            return (
                <Button onPress={setReady}>
                    <Text style={(isReady()) ? styles.isReady : styles.isNotReady}>Ready</Text>
                </Button>
            )
        }
    }

    // --------------------------------------------------------------

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

                    <Modal
                        visible={visible}
                        transparent={true}
                        onRequestClose={closeHandler}
                        animationType={'fade'}
                    >
                        <ModalComponent />
                    </Modal>

                    <View style={styles.titleContainer} >
                        <View style={styles.row}>
                            <View style={styles.back}>
                                <TouchableOpacity onPress={backButtonHandler}>
                                    <Ionicons name={'chevron-back'} size={40} color="black" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.title}>{"Code: " + roomCode}</Text>
                        </View>
                        <Text style={styles.subtitle}>{"Server: " + serverTag}</Text>
                    </View>
                    <View style={styles.playersContainer}>
                        <FlatList
                            data={users}
                            renderItem={renderPlayer}
                            keyExtractor={(user, index) => index.toString()}
                            numColumns={4}
                            scrollEnabled={false}
                        />
                    </View>
                    <View style={styles.sideContainer}>
                        <TouchableOpacity style={styles.sideButton}>
                            <Text style={styles.sideTitle}>Game Rules</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sideContainer}>
                        <TouchableOpacity style={styles.sideButton}>
                            <Text style={styles.sideTitle}>Game Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <GameButton />
                    </View>
                </ImageBackground>
            </View>
        );
    }
};

export default LobbyPage;