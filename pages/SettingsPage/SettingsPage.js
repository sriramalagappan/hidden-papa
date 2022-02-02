import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Modal, TextInput, TouchableOpacity, Text, Keyboard, Alert, Dimensions } from 'react-native';
import { DropdownStyles } from '../../theme/component-styles';
import styles from './styles';
import Background from '../../components/Background';
import * as wordActions from '../../store/actions/words';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import HomeButtonSmall from '../../components/HomeButtonSmall';
import { enWordCategories, defaultENWordCategories } from '../../data/WordCategories';
import DropDownPicker from 'react-native-dropdown-picker';
import { ENWords } from '../../data/Words';
import SmallButton from '../../components/SmallButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ServerLocations from '../../data/ServerLocations';
import LoadingComponent from '../../components/Loading';
import { CommonActions } from '@react-navigation/native';

import colors from '../../theme/colors'

const height = Dimensions.get('window').height;

const SettingsPage = (props) => {

    // #region Variables

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch();

    // Stateful Variables
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tmpWord, setTmpWord] = useState(null);
    const [modalType, setModalType] = useState("");
    const [mergedWordPacks, setWordPacks] = useState(null);
    const [mergedWords, setMergedWords] = useState(null);

    // Redux Variables
    const allWords = useSelector(state => state.words.words);
    const wordPacks = useSelector(state => state.words.wordPacks);

    const placeholderText = 'Please separate each word with a comma (apple, banana) OR separate each word on a new line like: \napple\nbanana'

    // #endregion

    // #region useEffects

    // onComponentMount
    useEffect(() => {
        dispatch(wordActions.getWordPacks());
        dispatch(wordActions.getWords());
    }, [])

    // loading
    useEffect(() => {
        if (allWords && wordPacks) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }

        const tmpMergedWords = (allWords) ? [...ENWords, ...allWords] : [...ENWords];
        setMergedWords(tmpMergedWords);
    }, [allWords, wordPacks]);

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

    const openAddHandler = () => {
        setModalType('add-wp');
        setVisible(true);
    }

    const openEditHandler = () => {
        setModalType('edit-wp');
        setVisible(true);
    }

    const openServerHandler = () => {
        setModalType('server');
        setVisible(true);
    }

    const closeHandler = () => {
        setVisible(false);
        setModalType('');
    }

    const updateServer = async (server) => {
        try {
            await AsyncStorage.setItem(
                'hp-server',
                JSON.stringify(server)
            );

            Alert.alert(
                "Server Changed",
                "Please restart this app to connect to the new server",
                [
                    { text: "OK" }
                ]
            );
        } catch (err) {
            console.log(err);
        }
    }

    const backButtonHandler = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Home' }
                ]
            })
        );
    }

    // #endregion

    // #region Local Components

    const ModalComponent = () => {
        switch (modalType) {
            case 'add-wp': {
                return AddWordPacksComponent();
            }
            case 'edit-wp': {
                return EditWordPacksComponent();
            }
            case 'server': {
                return ServerComponent();
            }
        }
    }

    const AddWordPacksComponent = () => {
        // Need to keep local copy and update functions here for performance
        const [wordPackName, setWordPackName] = useState("");
        const [words, setWords] = useState("");
        const [initLoad, setInitLoad] = useState(false);
        const [isKeyboardVisible, setKeyboardVisible] = useState(false);

        // see if there are previous values to load
        if (!initLoad) {
            if (tmpWord && tmpWord.wordPackName) {
                setWordPackName(tmpWord.wordPackName);
            }

            if (tmpWord && tmpWord.words) {
                setWords(tmpWord.words);
            }

            setInitLoad(true);
        }

        const updateWordPackName = (input) => {
            setWordPackName(input)
        }

        const updateWordList = (input) => {
            setWords(input);
        }

        const addWordPack = async () => {
            // parse words depending on whether the list is comma or new line delimitated
            const delimChar = (words.indexOf("\n") !== -1) ? '\n' : ','
            const wordArr = words.split(delimChar);
            for (let i = 0; i < wordArr.length; i++) {
                wordArr[i] = wordArr[i].trim(); // trim whitespace

                // if word was blank, remove it from array
                if (!wordArr[i]) {
                    wordArr.splice(i, 1);
                }
            }

            // Min length of word pack is 3 words
            if (wordArr.length < 3) {
                Alert.alert(
                    "More Words Needed",
                    "A Word Pack requires at least 3 words",
                    [
                        { text: "OK" }
                    ]
                );
                return;
            }

            // Duplicate Check
            if (wordPacks && wordPacks.indexOf(wordPackName) !== -1) {
                Alert.alert(
                    "Duplicate Word Pack",
                    "A Word Pack with this name already exists. Please either delete that word pack or choose a new name",
                    [
                        { text: "OK" }
                    ]
                );
                return;
            }

            // Name Check
            if (!wordPackName) {
                Alert.alert(
                    "Missing Word Pack Name",
                    "Please enter a pack name",
                    [
                        { text: "OK" }
                    ]
                );
                return;
            }

            // merge word pack name to list of word packs
            const newWordPacks = [...wordPacks];
            newWordPacks.push(wordPackName);
            dispatch(wordActions.saveWordPacks(newWordPacks));

            // merge words to all words
            const newWords = [...allWords];
            for (let i = 0; i < wordArr.length; i++) {
                const word = wordArr[i];
                const wordObj = { text: word, category: wordPackName };
                newWords.push(wordObj);
            }

            dispatch(wordActions.saveWords(newWords));
            setTmpWord({ wordPackName: "", words: "" });
            setVisible(false);
            setModalType('');
            Alert.alert(
                "Pack added",
                "Your word pack was added successfully",
                [
                    { text: "OK" }
                ]
            );
        }

        // special modal closer to ensure catagories are saved
        const closeHandlerInner = async () => {
            if (isKeyboardVisible) {
                setKeyboardVisible(false);
                Keyboard.dismiss();
            }
            else {
                setTmpWord({ wordPackName, words });
                setVisible(false);
            }
        }

        const onFocus = () => {
            setKeyboardVisible(true);
        }

        return (
            <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandlerInner}>
                <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={Keyboard.dismiss}>
                    <View style={styles.modalBodyGameSettings}>
                        <Text style={styles.boldText}>Add a Word Pack</Text>
                        <View style={styles.marginLrg} />
                        <Text style={styles.smallText}>Pack Name</Text>
                        <Input
                            onChangeText={updateWordPackName}
                            value={wordPackName}
                            placeholder={"Enter a name here"}
                            keyboardType={"default"}
                            autoCapitalize={"words"}
                            autoCorrect={false}
                            maxLength={15}
                            multiline={false}
                            numberOfLines={1}
                            textAlign={"center"}
                            onFocus={onFocus}
                            placeholderTextColor={colors.placeholder}
                        />
                        <View style={styles.marginLrg} />
                        <Text style={styles.smallText}>Words: </Text>
                        <View style={styles.marginSml} />
                        <View style={styles.largeInputContainer}>
                            <TextInput
                                onChangeText={updateWordList}
                                value={words}
                                placeholder={placeholderText}
                                keyboardType={"default"}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                maxLength={10000}
                                multiline={true}
                                textAlign={"left"}
                                style={styles.textInput}
                                onFocus={onFocus}
                                placeholderTextColor={colors.placeholder}
                            />
                        </View>
                        <Button onPress={addWordPack}>Save</Button>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    const EditWordPacksComponent = () => {
        // Need to keep local copy and update functions here for performance
        const [wordPackName, setWordPackName] = useState("");
        const [isKeyboardVisible, setKeyboardVisible] = useState(false);
        const [words, setWords] = useState("");

        const updateWordPackName = (input) => {
            setWordPackName(input.value);
            let filteredWords = mergedWords.filter(word => (input.value && word.category === input.value));
            let filteredWordsFormatted = "";
            for (let i = 0; i < filteredWords.length; i++) {
                if (filteredWords[i].text) {
                    filteredWordsFormatted += filteredWords[i].text + "\n";
                }
            }
            setWords(filteredWordsFormatted);
        }

        const updateWordList = (input) => {
            if (!isDefaultPack()) {
                setWords(input);
            }
        }

        const editWordPack = async () => {
            // parse words depending on whether the list is comma or new line delimitated
            const delimChar = (words.indexOf("\n") !== -1) ? '\n' : ','
            const wordArr = words.split(delimChar);
            for (let i = 0; i < wordArr.length; i++) {
                wordArr[i] = wordArr[i].trim(); // trim whitespace

                // if word was blank, remove it from array
                if (!wordArr[i]) {
                    wordArr.splice(i, 1);
                }
            }

            // Min length of word pack is 3 words
            if (wordArr.length < 3) {
                Alert.alert(
                    "More Words Needed",
                    "A Word Pack requires at least 3 words",
                    [
                        { text: "OK" }
                    ]
                );
                return;
            }

            // remove old copy of words
            const newWords = [...allWords];
            const newWordsFiltered = newWords.filter(word => (word.category !== wordPackName));

            // merge new words to filtered list
            for (let i = 0; i < wordArr.length; i++) {
                const word = wordArr[i];
                const wordObj = { text: word, category: wordPackName };
                newWordsFiltered.push(wordObj);
            }

            dispatch(wordActions.saveWords(newWordsFiltered));
            setVisible(false);
            setModalType('');
            Alert.alert(
                "Pack edited",
                "Your word pack was edited successfully",
                [
                    { text: "OK" }
                ]
            );
        }

        const deleteWordPack = async () => {
            const removeWordPack = async () => {

                // remove old copy of words
                const newWords = [...allWords];
                const newWordsFiltered = newWords.filter(word => (word.category !== wordPackName));
                dispatch(wordActions.saveWords(newWordsFiltered));

                // remove word pack
                const newWordPacks = [...wordPacks];
                let index = newWordPacks.indexOf(wordPackName);
                if (index !== -1) {
                    newWordPacks.splice(index, 1);
                }
                dispatch(wordActions.saveWordPacks(newWordPacks));

                Alert.alert(
                    "Pack deleted",
                    "Your word pack was deleted successfully",
                    [
                        { text: "OK" }
                    ]
                );
            }

            Alert.alert(
                "Delete Confirmation",
                "Are you sure you want to delete this word pack. This action is irreversible",
                [
                    { text: "OK", onPress: async () => { await removeWordPack(); } },
                    { text: "Cancel" }
                ]
            );
        }

        // special modal closer to ensure catagories are saved
        const closeHandlerInner = async () => {
            if (isKeyboardVisible) {
                setKeyboardVisible(false);
                Keyboard.dismiss();
            }
            else {
                setVisible(false);
            }
        }

        const onFocus = () => {
            setKeyboardVisible(true);
        }

        const isDefaultPack = () => {
            return (defaultENWordCategories.indexOf(wordPackName) !== -1);
        }


        return (
            <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandlerInner}>
                <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={Keyboard.dismiss}>
                    <View style={styles.modalBodyGameSettings}>
                        <Text style={styles.boldText}>Edit a Word Pack</Text>
                        <View style={styles.marginLrg} />
                        <Text style={styles.smallText}>Select a Pack</Text>
                        <DropDownPicker
                            items={mergedWordPacks}
                            placeholder={"Select a Word Pack"}
                            containerStyle={styles.dropdownStyle}
                            style={styles.primaryDropdown}
                            itemStyle={DropdownStyles.dropdownItem}
                            dropDownStyle={DropdownStyles.dropdownItemContainer}
                            onChangeItem={updateWordPackName}
                            globalTextStyle={DropdownStyles.dropdownSelectedText}
                            dropDownMaxHeight={height * .4}
                            activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                        />
                        <View style={styles.marginLrg} />
                        {(wordPackName) ? (
                            <View>
                                <Text style={styles.smallText}>Words: </Text>
                                <View style={styles.marginSml} />
                                <View style={styles.largeInputContainer}>
                                    <TextInput
                                        onChangeText={updateWordList}
                                        value={words}
                                        placeholder={placeholderText}
                                        keyboardType={"default"}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}
                                        maxLength={10000}
                                        multiline={true}
                                        textAlign={"left"}
                                        style={styles.textInput}
                                        onFocus={onFocus}
                                        placeholderTextColor={colors.placeholder}
                                    />
                                </View>
                                {(isDefaultPack()) ? (
                                    <View>
                                        <View style={styles.marginSml} />
                                        <Text style={styles.smallTextBold}>You cannot edit/delete default packs</Text>
                                    </View>
                                ) : (
                                    <View style={styles.row}>
                                        <SmallButton onPress={deleteWordPack} disabled={isDefaultPack()}>Delete</SmallButton>
                                        <SmallButton onPress={editWordPack} disabled={isDefaultPack()}>Save</SmallButton>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View />
                        )}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    const ServerComponent = () => {
        return (
            <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeHandler}>
                <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={Keyboard.dismiss}>
                    <View style={styles.modalBodyGameSettings}>
                        <Text style={styles.boldText}>Change Servers</Text>
                        <View style={styles.marginLrg} />
                        <DropDownPicker
                            items={ServerLocations}
                            containerStyle={styles.dropdownStyle}
                            style={styles.primaryDropdown}
                            itemStyle={DropdownStyles.dropdownItem}
                            dropDownStyle={DropdownStyles.dropdownItemContainer}
                            onChangeItem={item => updateServer(item.value)}
                            globalTextStyle={DropdownStyles.dropdownSelectedText}
                            placeholder={"Select a server location"}
                            dropDownMaxHeight={height * .3}
                            activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                        />
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    // #endregion

    // #region UI

    if (isLoading) {
        return (
            <LoadingComponent 
                backButtonFunction={backButtonHandler}
                text={"Please wait or press the back button to return to the home screen"}
            />
        )
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
                    >
                        <ModalComponent />
                    </Modal>

                    <View style={styles.row}>
                        <HomeButtonSmall text={"Add Word Packs"} icon={"add"} onPress={openAddHandler} iconComponent={"MaterialIcons"} />
                        <HomeButtonSmall text={"Edit Word Packs"} icon={"create"} onPress={openEditHandler} iconComponent={"MaterialIcons"} />
                    </View>
                    <View style={styles.row}>
                        <HomeButtonSmall text={"Change Server"} icon={"globe-outline"} onPress={openServerHandler} iconComponent={"Ionicons"} />
                    </View>

                </Background>
            </View>
        );
    }

    // #endregion
}

export default SettingsPage