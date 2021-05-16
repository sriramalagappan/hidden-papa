import { Platform } from 'react-native'
import { JOIN_ROOM, RESET_ROOM, UPDATE_ROOM_DATA, UPDATE_USERS_DATA, UPDATE_GAME_DATA } from '../actions/room';

const initialState = {
    roomCode: '146481',
    users: [],
    roomData: {},
    gameData: {},
    me: (Platform.OS === 'ios') ? 'fhf' : 'f',
}

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM: {
            return {
                ...initialState,
                roomCode: action.roomCode,
                me: action.username,
            }
        }
        case UPDATE_ROOM_DATA: {
            return {
                ...state,
                roomData: action.roomData,
            }
        }
        case UPDATE_USERS_DATA: {
            return {
                ...state,
                users: action.users,
            }
        }
        case UPDATE_GAME_DATA: {
            return {
                ...state,
                gameData: action.gameData
            }
        }
        case RESET_ROOM: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

export default roomReducer;