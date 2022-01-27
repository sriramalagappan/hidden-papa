import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultENWordCategories } from '../../data/WordCategories';
import { ENWords } from '../../data/Words';

export const GET_WORD_PACKS = 'GET_WORD_PACKS';
export const GET_WORDS = 'GET_WORDS';

// #region Word Packs

export const getWordPacks = () => {
    return async dispatch => {
        let wordPacks = await getWordPacksFromStorage();
        if (!wordPacks) {
            wordPacks = [];
        }
        dispatch({
            type: GET_WORD_PACKS,
            wordPacks,
        })
    }
}

export const saveWordPacks = (wordPacks) => {
    return async dispatch => {
        await saveWordPacksToStorage(wordPacks);
        dispatch({
            type: GET_WORD_PACKS,
            wordPacks,
        })
    }
}

// function to save avatar to device locally
const saveWordPacksToStorage = async (wordPacks) => {
    // store avatar information
    try {
        await AsyncStorage.setItem(
            'hp-word-packs',
            JSON.stringify({
                wordPacks,
            })
        );
    } catch (err) {
        console.log(err);
    }
}

// function to retrieve avatar from device locally
export const getWordPacksFromStorage = async () => {
    // retrieve avatar (returns null if it doesn't exist)
    try {
        const result = await AsyncStorage.getItem('hp-word-packs');
        return result != null ? (JSON.parse(result).wordPacks) : null;
    } catch (err) {
        console.log(err);
    }
}

// #endregion

// #region Words

export const getWords = () => {
    return async dispatch => {
        let words = await getWordsFromStorage();
        if (!words) {
            words = [];
        }
        dispatch({
            type: GET_WORDS,
            words,
        })
    }
}

export const saveWords = (words) => {
    return async dispatch => {
        await saveWordsToStorage(words);
        dispatch({
            type: GET_WORDS,
            words,
        })
    }
}

// function to save words to device locally
const saveWordsToStorage = async (words) => {
    // store words information
    try {
        await AsyncStorage.setItem(
            'hp-words',
            JSON.stringify({
                words,
            })
        );
    } catch (err) {
        console.log(err);
    }
}

// function to retrieve words from device locally
export const getWordsFromStorage = async () => {
    // retrieve words (returns null if it doesn't exist)
    try {
        const result = await AsyncStorage.getItem('hp-words');
        return result != null ? (JSON.parse(result).words) : null;
    } catch (err) {
        console.log(err);
    }
}

// function to remove words from device locally
export const removeWordsFromStorage = () => {
    try {
        AsyncStorage.removeItem('hp-word-packs');
        AsyncStorage.removeItem('hp-words');
    } catch (err) {
        console.log(err);
    }
}

// #endregion