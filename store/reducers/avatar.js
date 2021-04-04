import { GET_AVATAR } from '../actions/avatar';

const initialState = {
    avatar: {},
}

const avatarReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_AVATAR: {
            return {
                avatar: action.avatar
            }
        }
        default: {
            return state
        }
    }
}

export default avatarReducer;