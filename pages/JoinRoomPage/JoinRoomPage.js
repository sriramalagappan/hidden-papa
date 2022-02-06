import React, { useEffect, useState } from 'react';
import { View, Dimensions, Alert, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import { DropdownStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import Input from '../../components/Input';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import ServerLocations from '../../data/ServerLocations';
import { CommonActions } from '@react-navigation/native';
import Background from '../../components/Background';
import LottieView from 'lottie-react-native';

const height = Dimensions.get('window').height;

const idleBottomLeftAsset = '../../assets/animations/idle_bottom_left.json'

const JoinRoomPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    // used to verify when to move to lobby
    const roomCode = useSelector(state => state.room.roomCode)

    useEffect(() => {
        // when room code is loaded, that means the user connected to the room
        if (roomCode && !nav) {
            setNav(true);
            setIsLoading(true);

            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Lobby' }
                    ]
                })
            )
        }
    }, [roomCode])

    // Stateful Variables
    const [username, setUsername] = useState('');
    //const [server, setServer] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nav, setNav] = useState(false);

    const server = "usa" // default server for now

    const updateRoomCode = (input) => {
        if (input.length <= 6) {
            setRoomCodeInput(input)
        }

        if (input.length >= 6) {
            Keyboard.dismiss();
        }
    }

    const updateUsername = (newUsername) => {
        setUsername(newUsername);
    };

    const joinRoomHandler = async () => {
        // Precondition checks
        setIsLoading(true)
        if (!roomCodeInput || roomCodeInput.length !== 6) {
            Alert.alert("Room Code Required", "Please enter a valid room code")
        } else if (!username) {
            Alert.alert("Username Required", "Please enter a username")
        } else if (!server) {
            Alert.alert("Server Location Required", "Please choose a server location")
        } else {
            try {
                await api.init();
                await api.login();

                await dispatch(roomActions.joinRoom(roomCodeInput, username))
            } catch (err) {
                setIsLoading(false)
                Alert.alert("Sorry, something went wrong. Please try again", err.message);
            }
        }
        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <View pointerEvents="none" style={{
                    transform: [
                        { scaleY: -1 },
                    ]
                }}>
                    <LottieView
                        pointerEvents="none"
                        ref={() => { }}
                        style={styles.idleTopLeft}
                        source={require(idleBottomLeftAsset)}
                        loop={true}
                        autoPlay={true}
                    />
                </View>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <View style={styles.keyboardDismiss} />
                </TouchableWithoutFeedback>
                <View style={styles.roomCodeContainer}>
                    <Input
                        onChangeText={updateRoomCode}
                        value={roomCodeInput}
                        placeholder={"Room Code"}
                        keyboardType={"numeric"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        maxLength={6}
                        multiline={false}
                        numberOfLines={1}
                        textAlign={"center"}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        onChangeText={updateUsername}
                        value={username}
                        placeholder={"Enter a Username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        maxLength={15}
                        multiline={false}
                        numberOfLines={1}
                        textAlign={"center"}
                    />
                </View>
                {/* <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        items={ServerLocations}
                        containerStyle={styles.dropdownStyle}
                        style={styles.primaryDropdown}
                        itemStyle={DropdownStyles.dropdownItem}
                        dropDownStyle={DropdownStyles.dropdownItemContainer}
                        onChangeItem={item => setServer(item.value)}
                        globalTextStyle={DropdownStyles.dropdownSelectedText}
                        placeholder={"Select a server location"}
                        dropDownMaxHeight={height * .3}
                        activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                    />
                </View> */}
                <View style={styles.buttonContainer}>
                    <Button onPress={joinRoomHandler} isLoading={isLoading}>Join Room</Button>
                </View>
                <View pointerEvents="none" style={{
                    transform: [
                        { scaleX: -1 },
                    ]
                }}>
                    <LottieView
                        pointerEvents="none"
                        ref={() => { }}
                        style={styles.idleBottomRight}
                        source={require(idleBottomLeftAsset)}
                        loop={true}
                        autoPlay={true}
                    />
                </View>
            </Background>
        </View>
    );
};

export default JoinRoomPage;