import { JOIN_ROOM } from '../actions/room';

const initialState = {
    roomCode: '',
}

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM: {
            return {
                roomCode: action.roomCode
            }
        }
        default: {
            return state
        }
    }
}

export default roomReducer;