import * as avatarActions from './avatar';
import * as api from '../../api/firebaseMethods';
import { Alert } from "react-native";

export const JOIN_ROOM = 'JOIN_ROOM';

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