import { JOIN_ROOM, RESET_ROOM, UPDATE_ROOM_DATA, UPDATE_USERS_DATA } from '../actions/room';

const initialState = {
    roomCode: '425918',
    users: [],
    phase: '',
    gameTimeLength: 0,
    gameDifficulty: '',
    server: '',
    me: 'hope',
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
                phase: action.phase,
                gameTimeLength: action.gameTimeLength,
                gameDifficulty: action.gameDifficulty,
                server: action.server,
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