import * as avatarActions from './avatar';
import * as api from '../../api/firebaseMethods';
import { Alert } from "react-native";

export const JOIN_ROOM = 'JOIN_ROOM';
export const UPDATE_ROOM_DATA = 'UPDATE_ROOM_DATA';

export const createRoom = (roomCode, username) => {
    return async dispatch => {
        try {
            let avatar = await avatarActions.getAvatarFromStorage();
            // in case of null, just return default avatar
            if (!avatar) {
                avatar = avatarActions.defaultAvatar
            }            
            await api.createRoom(roomCode, username, avatar);
            dispatch({
                type: JOIN_ROOM,
                roomCode,
            })
        } catch (err) {
            Alert.alert('Error Creating Room', 'We ran into an issue while trying to create your room. Please try again or restart the app');
        }
    }
}

export const joinRoom = (roomCode, username) => {
    return async dispatch => {
        try {
            let avatar = await avatarActions.getAvatarFromStorage();
            // in case of null, just return default avatar
            if (!avatar) {
                avatar = avatarActions.defaultAvatar
            }            
            await api.joinRoom(roomCode, username, avatar);
            dispatch({
                type: JOIN_ROOM,
                roomCode,
            })
        } catch (err) {
            Alert.alert('Error Creating Room', 'We ran into an issue while trying to create your room. Please try again or restart the app');
        }
    }
}

export const updateRoomData = (data) => {
    return async dispatch => {
        try {
            dispatch({
                type: UPDATE_ROOM_DATA,
                users: data.users,
                phase: data.phase,
                gameTimeLength: data.gameTimeLength,
                gameDifficulty: data.gameDifficulty,
            })
        } catch (err) {
            console.log(err)
        }
    }
}