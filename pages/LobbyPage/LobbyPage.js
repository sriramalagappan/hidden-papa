import React, { useEffect, useState } from 'react';
import { View, Dimensions, ActivityIndicator, TouchableOpacity, Text, FlatList, Modal, Alert, ScrollView } from 'react-native';
import styles from './styles';
import { ImageStyles, DropdownStyles } from '../../theme/component-styles';
import Button from '../../components/Button';
import SmallButton from '../../components/SmallButton';
import { useDispatch, useSelector } from 'react-redux';
import BigHead from '../../components/BigHead';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ServerLocations from '../../data/ServerLocations';
import DropDownPicker from 'react-native-dropdown-picker';
import { enWordCategories } from '../../data/WordCategories';
import { CommonActions } from '@react-navigation/native';
import Background from '../../components/Background';
import Input from '../../components/Input';
import * as wordActions from '../../store/actions/words';
import LoadingComponent from '../../components/Loading';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const LobbyPage = (props) => {

    // #region Variables

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch();

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const users = useSelector(state => state.room.users);
    const gameTimeLength = useSelector(state => state.room.roomData.gameTimeLength);
    const gameDifficulty = useSelector(state => state.room.roomData.gameDifficulty);
    const server = useSelector(state => state.room.roomData.server);
    const me = useSelector(state => state.room.me);
    const msg = useSelector(state => state.room.roomData.msg);
    const categories = useSelector(state => state.room.roomData.wordCategories);
    const wordPacks = useSelector(state => state.words.wordPacks);

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading2, setIsLoading2] = useState(false);
    const [myPlayer, setMyPlayer] = useState(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [serverTag, setServerTag] = useState('');
    const [modalData, setModalData] = useState({});
    const [navigate, setNavigate] = useState(false);
    const [mergedWordPacks, setWordPacks] = useState(null);

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
            dispatch(roomActions.updateUsersData(data))
        }
    }
    // #endregion

    // #region UseEffects

    // componentDidMount
    useEffect(() => {
        dispatch(wordActions.getWordPacks());
    }, [])

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
        if (roomCode && users && (users.length) && gameDifficulty && categories.length) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, gameTimeLength, gameDifficulty, categories])

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

    useEffect(() => {
        // check if I have been assigned a role. If I have, game started: route me to next screen
        if (me && users && users.length && !isLoading && !navigate) {
            for (let i = 0; i < users.length; ++i) {
                const role = users[i].role
                if (users[i].username === me && role) {
                    setNavigate(true);
                    if (role === 'game-master') {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'GMWait' }
                                ]
                            })
                        );
                    } else if (role === 'hidden-papa') {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'HPWait' }
                                ]
                            })
                        )
                    } else if (role === 'guesser') {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'GuesserWait' }
                                ]
                            })
                        )
                    }
                }
            }
        }
    }, [users, isLoading])

    // message handlers
    useEffect(() => {
        if (msg && msg.type) {
            switch (msg.type) {
                case 'roomClosed': {
                    // host does not need to see this msg
                    if (!isHost) {
                        Alert.alert(
                            "Lobby Closed",
                            "This lobby is no longer active. Please create or join a new lobby",
                            [
                                { text: "OK", onPress: () => { routeHome() } }
                            ]
                        );
                    }
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
                    temp = location.label;
                }
            })
            setServerTag(temp)
        }
    }, [server])

    useEffect(() => {
        // merge custom word packs with default word packs
        const newWordPack = [...enWordCategories];
        if (wordPacks && wordPacks.length > 0) {
            newWordPack.push({ label: 'Custom Word Packs', value: 'custom', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle });
            for (let i = 0; i < wordPacks.length; i++) {
                const wordPack = wordPacks[i];
                const wordPackObj = { label: wordPack, value: wordPack, parent: 'custom', textStyle: DropdownStyles.dropdownItemText }
                newWordPack.push(wordPackObj);
            }
        } else {
            newWordPack.push({ label: 'Add your own word packs in the settings page!', value: '_', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle });
        }
        setWordPacks(newWordPack);
    }, [wordPacks]);

    // #endregion

    // #region Functions

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
        setVisible(false);
        setModalData({});
        setModalType('');
    }

    // send message to server to kick given player
    const kickPlayer = async (player) => {
        if (isHost()) {
            api.kickPlayer(roomCode, player);
            closeHandler();
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

    const loadingBackButton = () => {
        props.navigation.navigate('Home');
    }

    // route home and close room if host, or remove myself from room if player
    const routeHome = async () => {
        setVisible(false);
        setIsLoading(true);
        if (isHost()) {
            await api.sendMsg(roomCode, { type: 'roomClosed', to: '' });
        } else {
            await api.removePlayer(roomCode, me);
        }
        props.navigation.navigate('Home');
    }

    // tell room / server I'm ready
    const setReady = async () => {
        let newData = myPlayer;
        newData.isReady = !newData.isReady;
        await api.updateUser(roomCode, me, newData);
    }

    // open modal for player card
    const openPlayerModel = (player) => {
        setModalType('player');
        setModalData(player);
        setVisible(true);
    }

    // open modal for game settings
    const openGameSettingsModal = () => {
        setModalType('gameSettingsEdit');
        setVisible(true);
        //else setModalType('gameSettingsView')
    }

    // open modal for game rules
    const openGameRulesModal = () => {
        setModalType('gameRules');
        setVisible(true);
    }

    // start game by assigning roles to players
    const startGameHandler = async () => {
        setIsLoading2(true);
        await api.gameSetup(roomCode);
        setIsLoading2(false);
    }

    const setCategories = async (tempCategories) => {
        await api.updateCategories(roomCode, tempCategories);
    }

    const setTimeLimit = async (newLimit) => {
        if (!isNaN(newLimit)) {
            // multiply by 1000 to convert sec to ms
            const parsed = Math.abs(parseInt(newLimit)) * 1000;

            if (parsed >= 60000 && parsed <= 600000) {
                await api.updateTimeLimit(roomCode, (parsed));
            }
        }
    }

    // #endregion

    // #region Local Components

    const renderPlayer = (itemData) => (
        <View key={itemData.item.username} style={styles.player}>
            <TouchableOpacity onPress={() => { openPlayerModel(itemData.item) }}>
                {itemData.item.isReady ?
                    (<Ionicons style={styles.readyIcon} name={'checkmark-circle'} size={25} color={colors.green} />)
                    : (<View />)
                }
                {itemData.item.isHost ?
                    (<FontAwesome5 style={styles.readyIcon} name={'crown'} size={19} color={colors.yellow} />)
                    : (<View />)
                }
                <BigHead avatar={itemData.item.avatar} size={width * .23} />
                <Text style={styles.playerText}>{itemData.item.username}</Text>
            </TouchableOpacity>
        </View>
    )

    const ModalComponent = () => {
        switch (modalType) {
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
                                    <View style={styles.marginSml} />
                                    <Text style={styles.modalMessage}>Score: {modalData.score}</Text>
                                </View>
                                {KickButton}
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }

            case 'gameSettingsEdit': {

                // Need to keep local copy and update functions here for performance
                const curTimeLimit = (gameTimeLength / 1000).toString();
                const [localTimeLimit, setLocalTimeLimit] = useState(curTimeLimit);
                const [localCategories, setLocalCategories] = useState(categories);

                const updateLocal = (items) => {
                    setLocalCategories(items)
                }

                const updateLimit = (limit) => {
                    if (!isNaN(limit)) setLocalTimeLimit(limit);
                }

                const callSetCategories = async () => {
                    setCategories(localCategories)
                }

                // special modal closer to ensure catagories are saved
                const closeHandlerGS = async () => {
                    setCategories(localCategories)
                    setTimeLimit(localTimeLimit);
                    setVisible(false)
                    setModalData({})
                    setModalType('')
                }

                const dropDownText = (localCategories.length === 1) ? 'item has' : 'items have';

                if (isHost()) {
                    return (
                        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandlerGS}>
                            <TouchableOpacity style={styles.modal} activeOpacity={1}>
                                <View style={styles.modalBodyGameSettings}>
                                    <Text style={styles.modalPlayerText}>Game Settings</Text>
                                    <View style={styles.marginLrg} />
                                    <Text style={styles.smallText}>Time Limit (sec): </Text>
                                    <Input
                                        onChangeText={updateLimit}
                                        value={localTimeLimit}
                                        keyboardType={"numeric"}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}
                                        maxLength={3}
                                        multiline={false}
                                        numberOfLines={1}
                                        textAlign={"center"}
                                        editable={isHost()}
                                    />
                                    <View style={styles.marginSml} />
                                    <Text style={styles.smallText}>(1-10 minutes)</Text>
                                    <View style={styles.marginLrg} />
                                    <View style={styles.marginLrg} />
                                    <Text style={styles.smallText}>Select Word Categories: </Text>
                                    <View style={styles.marginSml} />
                                    <DropDownPicker
                                        items={mergedWordPacks}
                                        defaultValue={categories}
                                        containerStyle={styles.dropdownStyle}
                                        style={styles.primaryDropdown}
                                        itemStyle={DropdownStyles.dropdownItem}
                                        dropDownStyle={DropdownStyles.dropdownItemContainer}
                                        onChangeItem={items => updateLocal(items)}
                                        globalTextStyle={DropdownStyles.dropdownSelectedText}
                                        dropDownMaxHeight={height * .25}
                                        activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                                        multiple={true}
                                        multipleText={"%d " + dropDownText + " been selected."}
                                        min={1}
                                        onClose={callSetCategories}
                                        disabled={!isHost()}
                                    />
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                } else {
                    return (
                        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandlerGS}>
                            <TouchableOpacity style={styles.modal} activeOpacity={1}>
                                <View style={styles.modalBodyGameSettings}>
                                    <Text style={styles.modalPlayerText}>Game Settings</Text>
                                    <View style={styles.marginLrg} />
                                    <Text style={styles.smallText}>Time Limit (sec): </Text>
                                    <Input
                                        onChangeText={updateLimit}
                                        value={localTimeLimit}
                                        placeholder={curTimeLimit}
                                        keyboardType={"numeric"}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}
                                        maxLength={3}
                                        multiline={false}
                                        numberOfLines={1}
                                        textAlign={"center"}
                                        editable={isHost()}
                                    />
                                    <View style={styles.marginSml} />
                                    <Text style={styles.smallText}>(1-10 minutes)</Text>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }
            }

            case 'gameRules': {
                const PhaseOneText = "Players are separated into 3 roles: Game Master, Hidden Papa, and Guesser. " +
                    "The Game Master is given 3 words and must select a word. The selected word is then revealed " +
                    "to the Hidden Papa. Once everyone is ready, the next phase begins.";
                const PhaseTwoText = "The Guessers and Hidden Papa are given an amount of time to ask the Game Master " +
                    "yes-or-no questions regarding the word. If the word is " +
                    "guessed in time, the next phase begins. Otherwise, everyone loses and the game ends.";
                const PhaseThreeText = 'The time for the voting phase is same as the time it took to guess the word. ' +
                    "Everyone, including the Game Master, can discuss on who they think the Hidden Papa is. Once they come " +
                    "to a decision, they can click a player avatar and vote for that person. If the Hidden Papa receives the " +
                    "majority of the votes, the Guessers and Game Master win. Otherwise, the Hidden Papa wins."

                return (
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
                        <TouchableOpacity style={styles.modal} activeOpacity={1}>
                            <View style={styles.modalBodyGameRuleSettings}>
                                <ScrollView>
                                    <TouchableOpacity activeOpacity={1}>
                                        <Text style={styles.modalPlayerText}>Game Rules</Text>
                                        <View style={styles.marginLrg} />
                                        <Text style={styles.smallTextBold}>Phase 1: Roles</Text>
                                        <View style={styles.marginSml} />
                                        <Text style={styles.smallTextLeft}>{PhaseOneText}</Text>
                                        <View style={styles.marginLrg} />
                                        <Text style={styles.smallTextBold}>Phase 2: Guessing</Text>
                                        <View style={styles.marginSml} />
                                        <Text style={styles.smallTextLeft}>{PhaseTwoText}</Text>
                                        <View style={styles.marginLrg} />
                                        <Text style={styles.smallTextBold}>Phase 3: Voting</Text>
                                        <View style={styles.marginSml} />
                                        <Text style={styles.smallTextLeft}>{PhaseThreeText}</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                );
            }
            default: {
                return (
                    <View />
                )
            }
        }
    }

    // button shows as 'ready' button for non-hosts
    // button only displays for host when everyone else is ready
    const GameButton = () => {

        if (isLoading2) {
            return (<ActivityIndicator size={'small'} color={'black'} style={styles.loadingSml} />)
        }

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

    // #endregion

    // #region UI

    if (isLoading) {
        return (
            <LoadingComponent
                backButtonFunction={loadingBackButton}
                text={"Please wait or press the back button to return to the home screen"}
            />
        );
    } else {
        return (
            <View style={styles.container}>
                <Background justify={false}>

                    <Modal
                        visible={visible}
                        transparent={true}
                        onRequestClose={closeHandler}
                        animationType={'fade'}
                        statusBarTranslucent={true}
                        propagateSwipe={true}
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
                        <TouchableOpacity style={styles.sideButton} onPress={openGameRulesModal}>
                            <Text style={styles.sideTitle}>Game Rules</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sideContainer}>
                        <TouchableOpacity style={styles.sideButton} onPress={openGameSettingsModal}>
                            <Text style={styles.sideTitle}>Game Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <GameButton />
                    </View>
                </Background>
            </View>
        );
    }

    // #endregion
};

export default LobbyPage;