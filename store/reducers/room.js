import { JOIN_ROOM, RESET_ROOM, UPDATE_ROOM_DATA } from '../actions/room';

const initialState = {
    roomCode: '992683',
    users: [],
    phase: '',
    gameTimeLength: 0,
    gameDifficulty: '',
    me: '',
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
                users: action.users,
                phase: action.phase,
                gameTimeLength: action.gameTimeLength,
                gameDifficulty: action.gameDifficulty,
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