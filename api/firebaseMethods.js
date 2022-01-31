import firebase from "firebase";
import { Alert } from "react-native";
import firebaseConfigKorea from '../secrets/keysKR';
import firebaseConfigNA from '../secrets/keysNA';
import firebaseConfigEU from '../secrets/keysEU';
import { defaultENWordCategories } from '../data/WordCategories';
import { ENWords } from '../data/Words';
import * as wordActions from '../store/actions/words';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const init = async () => {
    // don't init if already initialized
    if (firebase.apps.length === 0) {

        // get selected server location
        const server = await retrieveServer();

        switch (server) {
            case "usa": {
                firebase.initializeApp(firebaseConfigNA);
                break;
            }
            case "korea": {
                firebase.initializeApp(firebaseConfigKorea);
                break;
            }
            case "eu": {
                firebase.initializeApp(firebaseConfigEU);
                break;
            }
            // default to NA
            default: {
                firebase.initializeApp(firebaseConfigNA);
                break;
            }
            //firebase.analytics();
        }
    }
}

export const login = async () => {
    // only login if necessary
    if (!firebase.auth().currentUser) {
        await firebase.auth().signInAnonymously().catch(function (error) {
            const errorMessage = error.message;
            Alert.alert("Sorry, something went wrong. Please try again", errorMessage);
        });
    }
}

export const createRoom = async (roomCode, username, avatar) => {
    try {
        const server = await retrieveServer();
        const db = firebase.firestore();
        await db.collection("rooms")
            .doc(roomCode)
            .set({
                roomCode,
                latestActionTime: Date.now(),
                gameDifficulty: 'normal',
                gameTimeLength: 300000, // 5 minutes
                server,
                msg: { type: '', to: '' },
                kicked: [],
                wordCategories: defaultENWordCategories,
                roomState: 'lobby'
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
                guesses: [],
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

        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        // Check if room exists/has at least one player
        if (users.length === 0) {
            throw "We could not find a room with the provided room code. Please check the code and try again";
        }

        // Check if room is full
        if (users.length >= 8) {
            throw "This room is currently full. Please try joining a new room or making your own"
        }

        // Check if game is in progress
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.roomState && data.roomState !== 'lobby') {
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

        await roomRef.collection('game').doc('results').delete(); // delete previous game results

        // set room state to game-started and update time
        await roomRef.set({
            roomState: 'word-selection',
            latestActionTime: Date.now(),
        }, { merge: true });

        // get users
        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        const roles = createRoles(users.length);

        const rolesShuffled = shuffle(roles);
        const usersShuffled = shuffle(users);

        // simulate role selection liking picking cards from a deck
        while (rolesShuffled.length) {
            // select random role from list
            const role = rolesShuffled.pop();
            // get next player
            const username = usersShuffled[roles.length];
            // assign role to player
            const userRef = roomRef.collection('users').doc(username);
            await userRef.set({ role, isReady: false, }, { merge: true });
        }

        let categories = [];

        // Get categories
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                categories = [...data.wordCategories]
            }
        });

        // merge default and stored words
        const customWords = await wordActions.getWordsFromStorage();
        const mergedWords = (customWords) ? [...ENWords, ...customWords] : [...ENWords];

        // get subset of words given categories
        let filteredWords = mergedWords.filter(word => categories.indexOf(word.category) !== -1)

        // select three unique words randomly
        let firstWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        let secondWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        while (secondWord === firstWord) {
            secondWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        }
        let thirdWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        while (thirdWord === firstWord || thirdWord === secondWord) {
            thirdWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        }

        const wordChoices = [firstWord, secondWord, thirdWord];

        // set words
        await roomRef.collection("game")
            .doc('words').set({
                wordChoices
            });


    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
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

export const updateTimeLimit = async (roomCode, gameTimeLength) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        await roomRef.set({
            gameTimeLength,
        }, { merge: true });
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const selectWord = async (roomCode, word) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // set words
        await roomRef.collection("game").doc('words').set({
            word,
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

export const startGame = async (roomCode) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // set room state to guessing and update time
        await roomRef.set({
            roomState: 'guessing',
            latestActionTime: Date.now(),
        }, { merge: true });

        // get users
        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        // set player states back to not ready
        // for (let i = 0; i < users.length; ++i) {
        //     const username = users[i];
        //     const userRef = roomRef.collection('users').doc(username);
        //     await userRef.set({ isReady: false, }, { merge: true });
        // }

        let gameTimeLength;
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                // default to 5 minutes
                gameTimeLength = (data.gameTimeLength) ? data.gameTimeLength : 300000
            }
        });

        // set game end timestamp
        await roomRef.collection("game")
            .doc('settings').set({
                // add 6 sec as padding for potential lag
                startTime: Date.now() + 6000,
                endTime: Date.now() + gameTimeLength
            });

    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const votingSetup = async (roomCode, user, guessStartTime) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // set room state to voting and update time
        await roomRef.set({
            roomState: 'voting',
            latestActionTime: Date.now(),
        }, { merge: true });

        let voteTimeLength = Date.now() - guessStartTime

        // set who guessed the word correctly and times
        await roomRef.collection("game")
            .doc('voting').set({
                wordGuessedBy: user,
                startTime: Date.now(),
                endTime: Date.now() + 10000 + voteTimeLength, // pad 10 seconds for lag
            });


    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

export const generateResults = async (roomCode, word) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // check if results are already being generated
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();

                if (data.roomState === 'lobby') return;
            }
        })

        // set room state to results and update time
        await roomRef.set({
            roomState: 'lobby',
            latestActionTime: Date.now(),
        }, { merge: true });

        // get users
        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        // check player votes
        let votes = [];
        const noVote = '__________NO VOTE__________';
        let hiddenPapa = '';

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userRef = roomRef.collection('users').doc(user);

            await userRef.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();

                    // find hidden papa for next part
                    if (data.role === 'hidden-papa') {
                        hiddenPapa = data.username;
                    }

                    if (data.vote) {
                        votes.push(data.vote);
                    } else {
                        votes.push(noVote);
                    }
                }
            });
        };

        let updateObject = {
            role: firebase.firestore.FieldValue.delete(),
            guesses: firebase.firestore.FieldValue.delete(),
            vote: firebase.firestore.FieldValue.delete(),
            isReady: false,
        };

        // find majority vote and see if it was correct        
        const gameWon = (findMajority(votes) === hiddenPapa) ? 1 : 0; // needs to be an integer

        // update player stats
        users.forEach(async (user) => {
            const userRef = roomRef.collection('users').doc(user);
            await userRef.get().then(async (doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    let update;
                    if (data.role === 'hidden-papa') {
                        update = (gameWon) ? {
                            gamesPlayed: data.gamesPlayed + 1,
                            ...updateObject
                        } : {
                            gamesPlayed: data.gamesPlayed + 1,
                            gamesWonHP: data.gamesWonHP + 1,
                            ...updateObject
                        }
                    } else {
                        update = (gameWon) ? {
                            gamesPlayed: data.gamesPlayed + 1,
                            gamesWonGuesser: data.gamesWonGuesser + 1,
                            ...updateObject
                        } : {
                            gamesPlayed: data.gamesPlayed + 1,
                            ...updateObject
                        }
                    }
                    await userRef.set({ ...update }, { merge: true });
                }
            });
        });

        const resultObj = { hiddenPapa, votes, word, gameWon };

        // push result to db
        await roomRef.collection("game").doc('results').set(resultObj);

        // cleanup db
        await roomRef.collection('game').doc('words').delete();
        await roomRef.collection('game').doc('settings').delete();
        await roomRef.collection('game').doc('voting').delete();
    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

// if word is not guessed in time, everyone losses
export const gameOver = async (roomCode, word) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // check if results are already being generated
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();

                if (data.roomState === 'lobby') return;
            }
        })

        // set room state to results and update time
        await roomRef.set({
            roomState: 'lobby',
            latestActionTime: Date.now(),
        }, { merge: true });

        // get users
        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        // find hidden papa
        let hiddenPapa;

        // update player stats
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userRef = roomRef.collection('users').doc(user);
            await userRef.get().then(async (doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const update = {
                        role: firebase.firestore.FieldValue.delete(),
                        guesses: firebase.firestore.FieldValue.delete(),
                        vote: firebase.firestore.FieldValue.delete(),
                        isReady: false,
                        gamesPlayed: data.gamesPlayed + 1,
                    };
                    await userRef.set({ ...update }, { merge: true });

                    // find username of hidden papa
                    if (data.role === 'hidden-papa') hiddenPapa = data.username;
                }
            });
        }

        const votes = [];

        const resultObject = { hiddenPapa, votes, word, gameWon: -1 };

        // push result to db
        await roomRef.collection("game").doc('results').set(resultObject);

        // cleanup db
        await roomRef.collection('game').doc('words').delete();
        await roomRef.collection('game').doc('settings').delete();
        await roomRef.collection('game').doc('voting').delete();

    } catch (err) {
        const errorMessage = err.message;
        console.log(errorMessage);
        throw err;
    }
}

// ---------------------------------- LISTENERS ----------------------------------

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

export const usersListener = async (roomCode, onChange) => {
    try {
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

// Function to find majority element
const findMajority = (arr) => {
    var count = 0, candidate = -1;

    // Finding majority candidate
    for (var index = 0; index < arr.length; index++) {
        if (count == 0) {
            candidate = arr[index];
            count = 1;
        }
        else {
            if (arr[index] == candidate)
                count++;
            else
                count--;
        }
    }

    // Checking if majority candidate occurs more than n/2 times
    for (var index = 0; index < arr.length; index++) {
        if (arr[index] == candidate)
            count++;
    }
    if (count > (arr.length / 2))
        return candidate;
    return -1;
}

const retrieveServer = async () => {
    // get selected server location
    const data = await AsyncStorage.getItem('hp-server');
    return (data != null) ? (JSON.parse(data)) : "usa";
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
 function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}