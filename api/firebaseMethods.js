import firebase from "firebase";
import { Alert } from "react-native";
import firebaseConfigKorea from '../secrets/keys';
import { defaultENWordCategories } from '../data/WordCategories';
import { ENWords } from '../data/Words';
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
                msg: { type: '', to: '' },
                kicked: [],
                wordCategories: defaultENWordCategories,
                roomState: 'open'
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
        const roomRef = db.collection('rooms').doc(roomCode)

        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id)

        // Check if room is full
        if (users.length >= 8) {
            throw "This room is currently full. Please try joining a new room or making your own"
        }

        // Check if game is in progress
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.roomState && data.roomState === 'game-started') {
                    throw "The lobby is currently in a game. Please wait for the game to end and then try joining";
                }
            }
        })

        // Check if dup username, then throw error
        if (users.indexOf(username) !== -1) {
            throw "The username, " + username + ", has already been taken. Please enter a new username";
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

export const sendMsg = async (roomCode, msg) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode)

        await roomRef.set({ msg }, { merge: true });

    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const kickPlayer = async (roomCode, user) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode)
        const userRef = roomRef.collection('users').doc(user)

        const msg = { type: 'kick', to: user }
        await roomRef.set({ msg }, { merge: true });

        await userRef.delete();
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const removePlayer = async (roomCode, user) => {
    try {
        const db = firebase.firestore();
        const userRef = db.collection('rooms').doc(roomCode)
            .collection('users').doc(user);

        await userRef.delete();
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const gameSetup = async (roomCode) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // set room state to game-started and update time
        await roomRef.set({
            roomState: 'game-started',
            latestActionTime: Date.now(),
        }, { merge: true });

        // get users
        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        const roles = createRoles(users.length);

        // simulate role selection liking picking cards from a deck
        while (roles.length) {
            // select random role from list
            const role = roles.pop();
            // get next player
            const username = users[roles.length];
            // assign role to player
            const userRef = roomRef.collection('users').doc(username);
            // set player states back to not ready
            await userRef.set({ role }, { merge: true });
        }

        let categories = []

        // Get categories
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                categories = [...data.wordCategories]
            }
        })

        // get subset of words given categories
        let words = ENWords.filter(word => categories.indexOf(word.category) !== -1)

        // select three unique words randomly
        const firstWord = words[Math.floor((Math.random() * words.length))].text;
        let secondWord = words[Math.floor((Math.random() * words.length))].text;
        while (secondWord === firstWord) {
            secondWord = words[Math.floor((Math.random() * words.length))].text;
        }
        let thirdWord = words[Math.floor((Math.random() * words.length))].text;
        while (thirdWord === firstWord || thirdWord === secondWord) {
            thirdWord = words[Math.floor((Math.random() * words.length))].text;
        }

        const wordChoices = [firstWord, secondWord, thirdWord]

        // set words
        await roomRef.collection("game")
            .doc('words').set({
                wordChoices
            })


    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

const insert = (array, index, elem) => {
    array.splice(index, 0, elem)
}

const createRoles = (len) => {
    const result = [];
    for (let i = 0; i < len - 2; ++i) {
        result.push('guesser');
    }
    // place game master role somewhere random in array
    const gmIndex = Math.floor((Math.random() * len - 1));
    insert(result, gmIndex, 'game-master');
    // place hidden papa role somewhere random in array
    const hpIndex = Math.floor((Math.random() * len));
    insert(result, hpIndex, 'hidden-papa');
    return result;
}

export const updateCategories = async (roomCode, wordCategories) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        await roomRef.set({
            wordCategories,
        }, { merge: true });
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const logout = async () => {
    try {
        await firebase.auth().signOut();
    } catch (err) {
        Alert.alert("Sorry, something went wrong. Please try again", err.message);
    }
}

// ---------------------------------- LISTENERS ----------------------------------

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
                users.sort(function (a, b) {
                    let tempA = a.username.toUpperCase();
                    let tempB = b.username.toUpperCase();

                    if (tempA < tempB || a.isHost) return -1;
                    if (tempA > tempB || b.isHost) return 1;
                    return 0;
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

export const gameListener = async (roomCode, onChange) => {
    try {
        // NEED TO REMOVE LOGIN
        init();
        await login();
        const db = firebase.firestore();
        const listener = db.collection('rooms').doc(roomCode).collection('game')
            .onSnapshot((querySnapshot) => {
                let gameData = {};
                querySnapshot.forEach((doc) => {
                    gameData[doc.id] = doc.data();
                })
                onChange(gameData)
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
