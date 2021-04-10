import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, ActivityIndicator, TouchableOpacity, Text, FlatList } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import BigHead from '../../components/BigHead';
import * as roomActions from '../../store/actions/room';
import * as api from '../../api/firebaseMethods';

const width = Dimensions.get('window').width;

const image = require('../../assets/Background.png')

const LobbyPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Stateful Variables
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const temp = [
        {
            avatar: {
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
            },
            username: 'OmnipotentTacos',
            isReady: false,
            isHost: true,
        },
        {
            avatar: {
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
            },
            username: 'Temp',
            isReady: true,
            isHost: false,
        },
        {
            avatar: {
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
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
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
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
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
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
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
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
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
            },
            username: 'Temp',
            isReady: false,
            isHost: false,
        },
        {
            avatar: {
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
                skinTone: "dark",
            },
            username: 'TempeTempeTempe',
            isReady: false,
            isHost: false,
        },
    ]

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode);
    const users = useSelector(state => state.room.users);
    const phase = useSelector(state => state.room.users);
    const gameTimeLength = useSelector(state => state.room.users);
    const gameDifficulty = useSelector(state => state.room.users);

    // Update Room State from listener function
    const updateRoomState = (data) => {
        if (data) {
            dispatch(roomActions.updateRoomData(data));
        }
    }

    let roomListener;

    // get listener for room on mount (and only if roomCode is given)
    useEffect(() => {
        const getRoomListener = async () => {
            roomListener = api.roomListener(roomCode, updateRoomState)
        }
        if (roomCode) {
            getRoomListener()
        }
    }, [roomCode])

    // set isLoading to false once we received all data
    useEffect(() => {
        if (roomCode && (users.length) && phase && gameTimeLength && gameDifficulty) {
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
        }
    }, [roomCode, users, phase, gameTimeLength, gameDifficulty])

    const renderPlayer = (itemData) => (
        <View key={itemData.item.username} style={styles.player}>
            <TouchableOpacity>
                <BigHead avatar={itemData.item.avatar} size={width * .23} />
                <Text style={styles.playerText}>{itemData.item.username}</Text>
            </TouchableOpacity>
        </View>
    )



    if (isLoading) {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} style={ImageStyles.background}>
                    <ActivityIndicator color={"black"} size={100} />
                </ImageBackground>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
                    <View style={styles.titleContainer} >
                        <Text style={styles.title}>{"Code: " + roomCode}</Text>
                        <Text style={styles.subtitle}>{"Server: " + ""}</Text>
                    </View>
                    <View style={styles.playersContainer}>
                        <FlatList
                            data={temp}
                            renderItem={renderPlayer}
                            keyExtractor={(user, index) => index.toString()}
                            numColumns={4}
                        />
                    </View>
                    <View style={styles.sideContainer}>
                        <TouchableOpacity style={styles.sideButton}>
                            <Text style={styles.sideTitle}>Game Settings</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sideContainer}>
                        <TouchableOpacity style={styles.sideButton}>
                            <Text style={styles.sideTitle}>Game Settings</Text>
                        </TouchableOpacity>
                    </View>

                    <Button onPress={() => {setIsReady(!isReady)}}><Text style={(isReady) ? styles.isReady : styles.isNotReady}>Ready</Text></Button>
                </ImageBackground>
            </View>
        );
    }
};

export default LobbyPage;