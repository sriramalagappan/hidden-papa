import * as avatarActions from './avatar';
import * as api from '../../api/firebaseMethods';
import { Alert } from "react-native";

export const JOIN_ROOM = 'JOIN_ROOM';
export const UPDATE_ROOM_DATA = 'UPDATE_ROOM_DATA';
export const UPDATE_USERS_DATA = 'UPDATE_USERS_DATA';
export const RESET_ROOM = 'RESET_ROOM';

export const createRoom = (roomCode, username, server) => {
    return async dispatch => {
        try {
            let avatar = await avatarActions.getAvatarFromStorage();
            // in case of null, just return default avatar
            if (!avatar) {
                avatar = avatarActions.defaultAvatar
            }            
            await api.createRoom(roomCode, username, avatar, server);
            dispatch({
                type: JOIN_ROOM,
                roomCode,
                username,
            })
        } catch (err) {
            Alert.alert('Error Creating Room', 'We ran into an issue while trying to create your room. Please try again or restart the app');
        }
    }
}

export const joinRoom = (roomCode, username, server) => {
    return async dispatch => {
        try {
            let avatar = await avatarActions.getAvatarFromStorage();
            // in case of null, just return default avatar
            if (!avatar) {
                avatar = avatarActions.defaultAvatar
            }            
            await api.joinRoom(roomCode, username, avatar, server);
            dispatch({
                type: JOIN_ROOM,
                roomCode,
                username
            })
        } catch (err) {
            Alert.alert('Error Joining Room', err);
        }
    }
}

export const updateRoomData = (data) => {
    return async dispatch => {
        try {
            dispatch({
                type: UPDATE_ROOM_DATA,
                phase: data.phase,
                gameTimeLength: data.gameTimeLength,
                gameDifficulty: data.gameDifficulty,
                server: data.server,
            })
        } catch (err) {
            console.log(err)
        }
    }
}

export const updateUsersData = (users) => {
    return async dispatch => {
        try {
            dispatch({
                type: UPDATE_USERS_DATA,
                users,
            })
        } catch (err) {
            console.log(err)
        }
    }
}

export const resetRoom = () => {
    return dispatch => {
        dispatch({
            type: RESET_ROOM,
        })
    }
}