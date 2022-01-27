import { GET_WORDS, GET_WORD_PACKS } from '../actions/words';

const initialState = {
    words: null,
    wordPacks: null,
}

const wordsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WORDS: {
            return {
                ...state,
                words: action.words,
            }
        }
        case GET_WORD_PACKS: {
            return {
                ...state,
                wordPacks: action.wordPacks,
            }
        }
        default: {
            return state
        }
    }
}

export default wordsReducer;