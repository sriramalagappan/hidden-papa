import { JOIN_ROOM, RESET_ROOM, UPDATE_ROOM_DATA, UPDATE_USERS_DATA } from '../actions/room';

const initialState = {
    roomCode: '146481',
    users: [],
    roomData: {},
    me: 'fhf',
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
        case RESET_ROOM: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

export default roomReducer;