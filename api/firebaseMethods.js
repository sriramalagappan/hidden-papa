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

export const joinRoom = async (roomCode, username, avatar) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // get current users
        let userData = [];
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data()
                userData = data.users.slice();
            } else {
                throw "Room does not exist"
            }
        })

        // add user locally
        userData.push({
            username: username,
            avatar: avatar,
            isHost: false,
            ready: false,
        })

        // push to db
        await roomRef.set({
            users: userData,
        }, { merge: true });
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
        //Alert.alert("Sorry, something went wrong. Please try again", errorMessage);   
    }
}

export const checkRoom = async (code) => {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("rooms").get()
        const rooms = snapshot.docs.map(doc => doc.id)
        return (rooms.indexOf(code) === -1)
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
        //Alert.alert("Sorry, something went wrong. Please try again", errorMessage);   
    }
}

export const roomListener = async (roomCode, onChange) => {
    try {
        const db = firebase.firestore();
        const listener = db.collection('rooms').doc(roomCode)
            .onSnapshot((doc) => {
                // execute onChange function provided given new data
                onChange(doc.data());
            }, (error) => {
                console.log(error);
                throw error;
            });
        return listener
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
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