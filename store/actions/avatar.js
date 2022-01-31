import AsyncStorage from '@react-native-async-storage/async-storage';

export const GET_AVATAR = 'GET_AVATAR';

export const defaultAvatar = {
    accessory: "none",
    body: "chest",
    clothing: "shirt",
    clothingColor: "black",
    eyebrows: "raised",
    eyes: "normal",
    facialHair: "none",
    graphic: "none",
    hair: "none",
    hairColor: "pink",
    hat: "none",
    hatColor: "green",
    lashes: false,
    lipColor: "pink",
    mouth: "openSmile",
    skinTone: "light",
}

export const checkAvatar = async () => {
    // see if the user already has a saved avatar
    // if not, create a new one
    const result = await getAvatarFromStorage();
    if (!result) {
        saveAvatarToStorage(defaultAvatar)
    }
}

export const getAvatar = () => {
    return async dispatch => {
        let avatar = await getAvatarFromStorage();
        // in case of null, just return default avatar and save
        if (!avatar) {
            avatar = defaultAvatar
            //saveAvatarToStorage(defaultAvatar)
        }
        dispatch({
            type: GET_AVATAR,
            avatar,
        })
    }
}

export const saveAvatar = (newAvatar) => {
    return async dispatch => {
        await saveAvatarToStorage(newAvatar);
        dispatch({
            type: GET_AVATAR,
            newAvatar,
        })
    }
}

// function to save avatar to device locally
const saveAvatarToStorage = async (avatar) => {
    // store avatar information
    try {
        await AsyncStorage.setItem(
            'hp-avatar',
            JSON.stringify({
                avatar,
            })
        );
    } catch (err) {
        console.log(err);
    }
}

// function to remove avatar from device locally
const removeAvatarFromStorage = () => {
    // remove avatar
    try {
        AsyncStorage.removeItem('hp-avatar');
    } catch (err) {
        console.log(err);
    }
}

// function to retrieve avatar from device locally
export const getAvatarFromStorage = async () => {
    // retrieve avatar (returns null if it doesn't exist)
    try {
        const result = await AsyncStorage.getItem('hp-avatar');
        return result != null ? (JSON.parse(result)).avatar : null;
    } catch (err) {
        console.log(err);
    }
}