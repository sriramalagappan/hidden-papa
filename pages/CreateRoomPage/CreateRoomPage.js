import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, Alert} from 'react-native';
import styles from './styles';
import { ImageStyles, DropdownStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import Input from '../../components/Input';
import { init, login, createRoom, isCodeUnique } from '../../api/firebaseMethods';

const height = Dimensions.get('window').height;

const image = require('../../assets/Background.png')

const CreateRoomPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Stateful Variables
    const [username, setUsername] = useState('');
    const [server, setServer] = useState('');

    const updateUsername = (newUsername) => {
        setUsername(newUsername);
    };

    const createRoomHandler = async () => {
        try {
            await init();
            await login();
            const roomCode = await generateUniqueRoomCode();
            await createRoom(roomCode);
        } catch (err) {
            Alert.alert("Sorry, something went wrong. Please try again", err.message);
        }
    }

    const roomCreatedHandler = () => {
        //props.navigation.navigate('Home');
    };

    const codeGenerator = () => {
        // create random code
        let result = "";
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        
        for (var i = 0; i < 6; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return result;
    }

    const generateUniqueRoomCode = async () => {
        // create code
        let code = codeGenerator();
        // verify that code is unique
        let result = await isCodeUnique(code);
        result = !result;
        while (result) {
            code = codeGenerator();
            result = await isCodeUnique(code);
            result = !result;
        }
        return code;
    }

    const dropdownData = [
        { label: 'North America', value: 'na', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
        { label: 'United States', value: 'usa', parent: 'na', textStyle: DropdownStyles.dropdownItemText },

        { label: 'Asia', value: 'asia', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
        { label: 'Korea', value: 'korea', parent: 'asia', textStyle: DropdownStyles.dropdownItemText },

        { label: 'More to come soon!', value: 'temp', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
    ];

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
                <View style={styles.inputContainer}>
                    <Input
                        onChangeText={updateUsername}
                        value={username}
                        placeholder={"Enter a username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        maxLength={20}
                        multiline={false}
                        numberOfLines={1}
                        textAlign={"left"}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        items={dropdownData}
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
                    <Button onPress={createRoomHandler}>Create Room</Button>
                </View>
            </ImageBackground>
        </View>
    );
};

export default CreateRoomPage;