import React, { useEffect, useState } from 'react';
import { View, ImageBackground, ActivityIndicator, Modal, TextInput, TouchableOpacity, Text, Keyboard, Alert} from 'react-native';
import styles from './styles';
import Background from '../../components/Background';
import * as wordActions from '../../store/actions/words';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../theme/colors'

const SettingsPage = (props) => {

    // #region Variables

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch();

    // Stateful Variables
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tmpWord, setTmpWord] = useState(null);

    // Redux Variables
    const allWords = useSelector(state => state.words.words);
    const wordPacks = useSelector(state => state.words.wordPacks);

    // #endregion

    // #region useEffects

    // onComponentMount
    useEffect(() => {
        dispatch(wordActions.getWordPacks());
        dispatch(wordActions.getWords());
    }, [])

    // loading
    useEffect(() => {
        // setTimeout(() => {
        //     setIsLoading(false)
        // }, 500);
        if (allWords && wordPacks) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [allWords, wordPacks])

    // #endregion

    // #region Functions

    const openHandler = () => {
        setVisible(true);
    }

    const closeHandler = () => {
        setVisible(false);
    }

    //wordActions.removeWordsFromStorage();

    // #endregion

    // #region Local Components

    const ModalComponent = () => {
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
            // parse words
            const wordArr = words.split(',');

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
                                placeholder={"Please separate each word with a comma and no space (Ex: apple,banana)"}
                                keyboardType={"default"}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                maxLength={1000}
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
        )
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

                    <Button onPress={openHandler}>Add a Word Pack</Button>

                </Background>
            </View>
        );
    }

    // #endregion
}

export default SettingsPage