import firebase from "firebase";
import { Alert } from "react-native";
import firebaseConfigKorea from '../secrets/keys';
// import ENwords from '../data/en-words';

export const init = () => {
    // only initialize if necessary
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfigKorea);
        //firebase.analytics();
    }
}

export const login = async () => {
    // only login if necessary
    if (!firebase.auth().currentUser) {
        await firebase.auth().signInAnonymously().catch(function (error) {
            // const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert("Sorry, something went wrong. Please try again", errorMessage);
        });
    }
}

export const createRoom = async (roomCode, username, avatar) => {
    try {
        const db = firebase.firestore();
        db.collection("rooms")
            .doc(roomCode)
            .set({
                roomCode,
                users: [
                    {
                        username: username, 
                        avatar: avatar, 
                        isHost: true,
                        ready: false,
                    }
                ],
                latestActionTime: Date.now(),
                gameDifficulty: 'normal',
                gameTimeLength: 300000, // 5 minutes
                phase: 'prep',
                game: {} // stores contents of game once it begins
            })
    } catch (err) {
        const errorMessage = err.message;
        Alert.alert("Sorry, something went wrong. Please try again", errorMessage);   
    }
}

export const isCodeUnique = async (code) => {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("rooms").get()
        const rooms = snapshot.docs.map(doc => doc.id)
        return (rooms.indexOf(code) === -1)
    } catch (err) {
        const errorMessage = err.message;
        Alert.alert("Sorry, something went wrong. Please try again", errorMessage);   
    }
}

// export const setEnWords = async () => {
//     try {
//         const db = firebase.firestore();
//         db.collection("en-words")
//             .doc()
//             .set({
//                 ENwords,
//             });
//     } catch (err) {
//         Alert.alert("Sorry, something went wrong. Please try again", err.message);
//     }
// }

export const logout = async () => {
    try {
        await firebase.auth().signOut();
    } catch (err) {
        Alert.alert("Sorry, something went wrong. Please try again", err.message);
    }
}