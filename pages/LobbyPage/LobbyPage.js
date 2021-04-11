import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, ActivityIndicator, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
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

    const temp = [
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'OmnipotentTacos',
            isReady: true,
            isHost: true,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'Temp',
            isReady: true,
            isHost: false,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'Temp',
            isReady: true,
            isHost: false,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'Temp',
            isReady: true,
            isHost: false,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "light",
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
                accessory: "none",
                body: "chest",
                clothing: "shirt",
                clothingColor: "black",
                eyebrows: "raised",
                eyes: "normal",
                facialHair: "none",
                graphic: "none",
                hair: "none",
                hairColor: "pink",
                hat: "none",
                hatColor: "green",
                lashes: false,
                lipColor: "pink",
                mouth: "openSmile",
                skinTone: "dark",
            },
            username: 'TempeTempeTempe',
            isReady: false,
            isHost: false,
        },
    ]

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const users = useSelector(state => state.room.users);
    const phase = useSelector(state => state.room.phase);
    const gameTimeLength = useSelector(state => state.room.gameTimeLength);
    const gameDifficulty = useSelector(state => state.room.gameDifficulty);
    const server = useSelector(state => state.room.server);
    const me = useSelector(state => state.room.me)

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
            // detach room listener
            if (roomListener) roomListener();
            if (usersListener) usersListener();
        })
    }, [roomCode])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && users && (users.length) && phase && gameTimeLength && gameDifficulty) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, phase, gameTimeLength, gameDifficulty])

    useEffect(() => {
        if (users && users.length) {
            let temp = null
            for (let i = 0; i < users.length; ++i) {
                if (users[i].username === me) temp = users[i];
            }
            setMyPlayer(temp)
        }
    }, [users])

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

    const isHost = () => {
        return (myPlayer && myPlayer.isHost);
    }

    const isReady = () => {
        return (myPlayer && myPlayer.isReady);
    }

    const isEveryoneReady = () => {
        if (users.length < 4) return false;
        for (let i = 0; i < users.length; ++i) {
            if (!users[i].isReady) return false;
        }
        return true;
    }

    /**
    * handler when user touches outside of modal
    */
    const closeHandler = () => {
        setVisible(false)
    }

    /**
     * open modal and display back button warning
     */
    const backButtonHandler = () => {
        setModalType('back')
        setVisible(true)
    }

    const routeHome = () => {
        setVisible(false)
        if (isHost()) {
            // do something
        }
        props.navigation.navigate('Home')
    }

    const setReady = async () => {
        let newData = myPlayer
        newData.isReady = !newData.isReady
        await api.updateUser(roomCode, me, newData);
    }

    // --------------------------------------------------------------

    const renderPlayer = (itemData) => (
        <View key={itemData.item.username} style={styles.player}>
            <TouchableOpacity>
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
            case 'back': {
                return (
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
                        <TouchableOpacity style={styles.modal} activeOpacity={1}>
                            <View style={styles.modalBody}>
                                <View style={styles.modalMessageContainer}>
                                    <Text style={styles.modalMessage}>Are you sure you want to leave the lobby?
                                    If you are the host, everyone will be removed from the lobby.</Text>
                                </View>
                                <View style={styles.modalRow}>
                                    <SmallButton onPress={closeHandler}>No</SmallButton>
                                    <SmallButton onPress={routeHome}>Yes</SmallButton>
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

    // button shows as ready for non-hosts
    // button only displays for host when everyone else is ready
    const GameButton = () => {
        if (isHost()) {

            if (isEveryoneReady()) {
                return (
                    <Button onPress={() => { }}>
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