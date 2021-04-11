import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, Alert, Text } from 'react-native';
import styles from './styles';
import { ImageStyles, DropdownStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import Input from '../../components/Input';
import { init, login } from '../../api/firebaseMethods';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';
import ServerLocations from '../../data/ServerLocations';
import CharacterInput from 'react-native-character-input'

const height = Dimensions.get('window').height;

const image = require('../../assets/Background.png')

const JoinRoomPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    // used to verify when to move to lobby
    const roomCode = useSelector(state => state.room.roomCode)

    useEffect(() => {
        // when room code is loaded, that means the user connected to the room
        if (roomCode) {
            props.navigation.replace("Lobby")
        }
    }, [roomCode])

    // Stateful Variables
    const [username, setUsername] = useState('');
    const [server, setServer] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateRoomCode = (input) => {
        if (input.length <= 6) {
            setRoomCodeInput(input)
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
                await init();
                await login();

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
            <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
                <View style={styles.roomCodeContainer}>
                    <Text style={styles.text}>Room Code: </Text>
                    <CharacterInput 
                        placeHolder='      '
                        showCharBinary='111111'
                        handleChange={(value) => updateRoomCode(value)}
                        inputType='contained'
                        keyboardType="numeric"
                        inputStyle={styles.inputText}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        onChangeText={updateUsername}
                        value={username}
                        placeholder={"Enter a username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        maxLength={15}
                        multiline={false}
                        numberOfLines={1}
                        textAlign={"left"}
                    />
                </View>
                <View style={styles.dropdownContainer}>
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
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={joinRoomHandler} isLoading={isLoading}>Join Room</Button>
                </View>
            </ImageBackground>
        </View>
    );
};

export default JoinRoomPage;