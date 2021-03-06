import React, { useEffect, useState } from 'react';
import { View, Dimensions, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './styles';
import { DropdownStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import Input from '../../components/Input';
import * as roomActions from '../../store/actions/room';
import ServerLocations from '../../data/ServerLocations';
import { CommonActions } from '@react-navigation/native';
import Background from '../../components/Background';
import * as api from '../../api/firebaseMethods';
import LottieView from 'lottie-react-native';

const height = Dimensions.get('window').height;

const CreateRoomPage = (props) => {

    // #region Variables

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch();

    // Redux Store-State Variables
    // used to verify when to move to lobby
    const roomCode = useSelector(state => state.room.roomCode);

    // Stateful Variables
    const [username, setUsername] = useState('');
    //const [server, setServer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nav, setNav] = useState(false);

    // #endregion

    // #region UseEffect

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
    }, [roomCode]);

    // #endregion

    // #region Functions

    const updateUsername = (newUsername) => {
        setUsername(newUsername);
    };

    const createRoomHandler = async () => {
        // Precondition checks
        setIsLoading(true)
        if (!username) {
            Alert.alert("Username Required", "Please enter a username")
        } else {
            try {
                await api.init();
                await api.login();
                const roomCode = await generateUniqueRoomCode();
                await dispatch(roomActions.createRoom(roomCode, username))
            } catch (err) {
                setIsLoading(false)
                Alert.alert("Sorry, something went wrong. Please try again", err.message);
            }
        }
        setIsLoading(false)
    }

    const codeGenerator = () => {
        // create random code
        let result = "";
        const charset = "1234567890";

        for (var i = 0; i < 6; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return result;
    }

    const generateUniqueRoomCode = async () => {
        // create code
        let code = codeGenerator();
        // verify that code is unique
        let result = await api.checkRoom(code);
        result = !result;
        while (result) {
            code = codeGenerator();
            result = await api.checkRoom(code);
            result = !result;
        }
        return code;
    }

    // #endregion

    // #region UI

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <View style={styles.keyboardDismiss} />
                </TouchableWithoutFeedback>
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
                    <Button onPress={createRoomHandler} isLoading={isLoading}>Create Room</Button>
                </View>
            </Background>
        </View>
    );

    // #endregion
};

export default CreateRoomPage;