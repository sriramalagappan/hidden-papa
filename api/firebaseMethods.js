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
        }
    }
}

export const login = async () => {
    // only login if necessary
    if (!firebase.auth().currentUser) {
        await firebase.auth().signInAnonymously().catch(function (error) {
            const errorMessage = error.message;
            console.log('firebaseMethods.login:', errorMessage);
            Alert.alert("Sorry, something went wrong when trying to login. Please try again");
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
                score: 0,
            });

    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.createRoom:', errorMessage);
        Alert.alert("Sorry, something went wrong when creating the room. Please try again");
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
        console.log('firebaseMethods.joinRoom:', errorMessage);
        Alert.alert("Sorry, something went wrong when joining the room. Please try again", errorMessage);
        throw err;
    }
}

/**
 * See if given room code exists in list of rooms
 * @param {*} roomCode room code to check
 * @returns {Boolean} true if room exists, false otherwise
 */
export const checkRoom = async (roomCode) => {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("rooms").get();
        const rooms = snapshot.docs.map(doc => doc.id);
        return (rooms.indexOf(roomCode) === -1);
    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.checkRoom:', errorMessage);
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
        console.log('firebaseMethods.updateUser:', errorMessage);
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
        console.log('firebaseMethods.sendMsg:', errorMessage);
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
        console.log('firebaseMethods.kickPlayer:', errorMessage);
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
        console.log('firebaseMethods.removePlayer:', errorMessage);
        throw err;
    }
}

/**
 * Prepare room to start a new game
 * @param {Number} roomCode room code
 */
export const gameSetup = async (roomCode) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);
        await roomRef.collection('game').doc('results').delete(); // delete previous game results

        await updateRoomState(roomCode, 'word-selection');

        // get users
        const userSnapshot = await roomRef.collection("users").get();
        const users = userSnapshot.docs.map(doc => doc.id);

        // generate roles
        const roles = createRoles(users.length);

        // shuffle in case to ensure randomization
        const rolesShuffled = shuffle(roles);
        const usersShuffled = shuffle(users);

        // ensure correct amount of roles were generated
        if (rolesShuffled.length !== usersShuffled.length) {
            await updateRoomState(roomCode, 'lobby');
            throw "Error generating roles, please try again";
        }

        // assign roles to user
        while (rolesShuffled.length) {
            // select random role from list
            const role = rolesShuffled.pop();
            // get next player
            const username = usersShuffled[roles.length];
            // assign role to player
            const userRef = roomRef.collection('users').doc(username);
            await userRef.set({ role, isReady: false, }, { merge: true });
        }

        // get word catagories
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

        // get subset of words that match selected categories
        let filteredWords = mergedWords.filter(word => categories.indexOf(word.category) !== -1)

        // select three unique words randomly
        let firstWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        let secondWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        // ensure uniqueness
        while (secondWord === firstWord) {
            secondWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        }
        let thirdWord = filteredWords[Math.floor((Math.random() * filteredWords.length))].text;
        // ensure uniqueness
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
        console.log('firebaseMethods.gameSetup:', errorMessage);
        throw err;
    }
}

/**
 * Update word categories property in room
 * @param {Number} roomCode room code
 * @param {Array} wordCategories new selected word categories
 */
export const updateCategories = async (roomCode, wordCategories) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        await roomRef.set({
            wordCategories,
        }, { merge: true });
    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.updateCatagories:', errorMessage);
        throw err;
    }
}

/**
 * Update game time length property in room
 * @param {Number} roomCode room code
 * @param {Number} gameTimeLength new game time length
 */
export const updateTimeLimit = async (roomCode, gameTimeLength) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        await roomRef.set({
            gameTimeLength,
        }, { merge: true });
    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.updateTimeLimit:', errorMessage);
        throw err;
    }
}

/**
 * Set selected word for room/game
 * @param {Number} roomCode room code of current game
 * @param {String} word selected word
 */
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
        console.log('firebaseMethods.selectWord:', errorMessage);
        throw err;
    }
}

/**
 * Sign out of firebase auth
 */
export const logout = async () => {
    try {
        await firebase.auth().signOut();
    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.logout:', errorMessage);
        Alert.alert("Sorry, something went wrong. Please try again", err.message);
    }
}

/**
 * Start guessing phase by setting times
 * @param {Number} roomCode room code of current game
 */
export const startGame = async (roomCode) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // set room state to guessing and update time
        await updateRoomState(roomCode, 'guessing');

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
                startTime: Date.now() + 6000,  // add 6 sec as padding for lag
                endTime: Date.now() + gameTimeLength
            });

    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.startGame:', errorMessage);
        throw err;
    }
}

/**
 * Setup game for voting phase
 * @param {Number} roomCode room code of current game
 * @param {String} user username of user who guessed the word
 * @param {Number} wordGuessedTime timestamp of time the guess phase started
 */
export const votingSetup = async (roomCode, user, gameStartTime) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        await updateRoomState(roomCode, 'voting');

        // get voting time length by subtracting now to when game began
        let voteTimeLength = Date.now() - gameStartTime;

        // set who guessed the word correctly and times
        await roomRef.collection("game")
            .doc('voting').set({
                wordGuessedBy: user,
                startTime: Date.now(), // start voting now
                endTime: Date.now() + 10000 + voteTimeLength, // pad 10 seconds for lag
                guessTime: voteTimeLength, // amount of time it took to guess word
            });


    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.votingSetup:', errorMessage);
        throw err;
    }
}

/**
 * Voting Phase Over: Generate results for game
 * @param {Number} roomCode room code of current game
 * @param {String} word the word guessed
 */
export const generateResults = async (roomCode, word) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // check if results are already being generated, then exit
        await roomRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();

                if (data.roomState === 'lobby') return;
            }
        });

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
        const noVote = '__________NO VOTE__________'; // impossible name to have
        let hiddenPapa = '';

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userRef = roomRef.collection('users').doc(user);

            await userRef.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();

                    // find hidden papa for next part
                    if (data.role === 'hidden-papa') hiddenPapa = data.username;

                    if (data.vote) {
                        votes.push(data.vote);
                    } else {
                        votes.push(noVote);
                    }
                }
            });
        };

        // get amount of time it took to guess word

        // find majority vote and see if it was correct        
        const gameWon = (findMajority(votes) === hiddenPapa) ? 1 : 0; // needs to be an integer

        let updateObject = {
            role: firebase.firestore.FieldValue.delete(),
            guesses: firebase.firestore.FieldValue.delete(),
            vote: firebase.firestore.FieldValue.delete(),
            isReady: false,
        };

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
                            score: data.score + 2,
                            ...updateObject
                        }
                    } else {
                        // determine if this user voted correctly
                        const votePoints = (data.vote === hiddenPapa) ? 1 : 0;
                        update = (gameWon) ? {
                            gamesPlayed: data.gamesPlayed + 1,
                            gamesWonGuesser: data.gamesWonGuesser + 1,
                            score: data.score + votePoints + 1,
                            ...updateObject
                        } : {
                            gamesPlayed: data.gamesPlayed + 1,
                            score: data.score + votePoints,
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
        console.log('firebaseMethods.generateResults:', errorMessage);
        throw err;
    }
}

/**
 * Guessing Phase Over: No one guessed the word so everyone losses.
 * Generate results for game
 * @param {Number} roomCode room code of current game
 * @param {String} word the word guessed
 */
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
        console.log('firebaseMethods.gameOver:', errorMessage);
        throw err;
    }
}

/**
 * Update room state property in database
 * @param {Number} roomCode room code
 * @param {String} roomState description of room state
 */
export const updateRoomState = async (roomCode, roomState) => {
    try {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomCode);

        // set room state and update time
        await roomRef.set({
            roomState: roomState,
            latestActionTime: Date.now(),
        }, { merge: true });
    } catch (err) {
        const errorMessage = err.message;
        console.log('firebaseMethods.updateRoomState:', errorMessage);
        throw err;
    }
}

// ---------------------------------- LISTENERS ----------------------------------

/**
 * Listener for room
 * @param {Number} roomCode room code of current game
 * @param {Function} onChange Function to execute on data change
 * @returns 
 */
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
        console.log('firebaseMethods.roomListener:', errorMessage);
        throw err;
    }
}

/**
 * Listener for collection of users in room
 * @param {Number} roomCode room code of current game
 * @param {Function} onChange Function to execute on data change
 * @returns 
 */
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
        console.log('firebaseMethods.usersListener:', errorMessage);
        throw err;
    }
}

/**
 * Listener for game properties in room
 * @param {Number} roomCode room code of current game
 * @param {Function} onChange Function to execute on data change
 * @returns 
 */
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
        console.log('firebaseMethods.gameListener:', errorMessage);
        throw err;
    }
}

/**
 * Insert function for JS array
 * @param {Array} array array to insert element into
 * @param {Number} index position in array to insert element into
 * @param {*} elem element to insert
 */
const insert = (array, index, elem) => {
    array.splice(index, 0, elem)
}

/**
 * Create a list of roles of a given length
 * @param {*} len length of array to return
 * @returns {Array} array of roles
 */
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

/**
 * Find the majority element in a list of votes
 * @param {*} arr An array of elements
 * @returns The majority element in the array, or -1 if no majority
 */
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

/**
 * retrieve user server location from local device
 * @returns {String} server location
 */
const retrieveServer = async () => {
    // get selected server location
    const data = await AsyncStorage.getItem('hp-server');
    return (data != null) ? (JSON.parse(data)) : "usa";
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * @return {Array} the shuffled array
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}