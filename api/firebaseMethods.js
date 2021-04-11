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

export const createRoom = async (roomCode, username, avatar, server) => {
    try {
        const db = firebase.firestore();
        await db.collection("rooms")
            .doc(roomCode)
            .set({
                roomCode,
                latestActionTime: Date.now(),
                gameDifficulty: 'normal',
                gameTimeLength: 300000, // 5 minutes
                phase: 'prep',
                server,
            });

        await db.collection("rooms")
            .doc(roomCode).collection("users")
            .doc(username).set({
                username,
                avatar,
                isHost: true,
                isReady: false,
                gamesPlayed: 0,
                gamesWonHP: 0,
                gamesWonGuesser: 0,
            })

    } catch (err) {
        const errorMessage = err.message;
        Alert.alert("Sorry, something went wrong. Please try again", errorMessage);
    }
}

export const joinRoom = async (roomCode, username, avatar, server) => {
    try {
        const db = firebase.firestore();

        const userSnapshot = await db.collection("rooms")
            .doc(roomCode).collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id)

        // Check if room is full
        if (users.length >= 8) {
            throw "This room is currently full. Please try joining a new room or making your own"
        }

        // Check if dup username, then throw error
        if (users.indexOf(username) !== -1) {
            throw "The username, " + username + ", has already been taken. Please enter a new username"
        }

        await db.collection("rooms")
            .doc(roomCode).collection("users")
            .doc(username).set({
                username,
                avatar,
                isHost: false,
                isReady: false,
                gamesPlayed: 0,
                gamesWonHP: 0,
                gamesWonGuesser: 0,
            })


    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
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
    }
}

export const roomListener = async (roomCode, onChange) => {
    try {
        // NEED TO REMOVE LOGIN
        init();
        await login();
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

export const usersListener = async (roomCode, onChange) => {
    try {
        // NEED TO REMOVE LOGIN
        init();
        await login();
        const db = firebase.firestore();
        const listener = db.collection('rooms').doc(roomCode).collection('users')
            .onSnapshot((querySnapshot) => {
                let users = [];
                querySnapshot.forEach((doc) => {
                    users.push(doc.data());
                })
                onChange(users)
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

export const updateUser = async (roomCode, user, data) => {
    try {
        const db = firebase.firestore();
        const userRef = db.collection('rooms')
            .doc(roomCode).collection('users')
            .doc(user);

        await userRef.set({ ...data }, { merge: true });

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


        // await roomRef.get().then((doc) => {
        //     if (doc.exists) {
        //         const data = doc.data()
        //         //console.log(data);
        //         //userData = data.users.slice();
        //     } else {
        //         throw "We could not find a room with the given room code. Please check the code and server location and try again"
        //     }
        // })
