import { JOIN_ROOM, UPDATE_ROOM_DATA } from '../actions/room';

const initialState = {
    roomCode: '',
    users: [],
    phase: '',
    gameTimeLength: 0,
    gameDifficulty: '',
}

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM: {
            return {
                ...initialState,
                roomCode: action.roomCode
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
        default: {
            return state
        }
    }
}

export default roomReducer;