import React, { useEffect, useCallback, useState } from 'react';
import { View, ImageBackground, InteractionManager } from 'react-native';
import styles from './styles';
import HomeButtonLarge from '../../components/HomeButtonLarge'
import HomeButtonSmall from '../../components/HomeButtonSmall'
import HomeButtonAvatar from '../../components/HomeButtonAvatar'
import { ImageStyles } from '../../theme/component-styles';
import * as avatarActions from '../../store/actions/avatar';
import * as roomActions from '../../store/actions/room';
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';

const image = require('../../assets/Background.png')

const HomePage = (props) => {

    // Redux Store State Variable
    const avatar = useSelector(state => state.avatar.avatar);

    // Stateful Variables
    const [avatarCopy, setAvatarCopy] = useState({}) // used for performance
    const [isLoading, setIsLoading] = useState(true)

    
    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // componentDidMount
    useFocusEffect(
        React.useCallback(() => {
            const getAvatar = async () => {
                await dispatch(avatarActions.getAvatar());
            }

            InteractionManager.runAfterInteractions(() => {
                getAvatar();
                setIsLoading(false);
                dispatch(roomActions.resetRoom());
            });

            return () => {
                setIsLoading(true);
            };
        }, [])
    );

    // update avatar whenever changed after done loading
    useEffect(() => {
        if (!isLoading) {
            setAvatarCopy(avatar)
        }
    }, [avatar, isLoading])

    const AvatarButtonHandler = () => {
        props.navigation.navigate('Avatar');
    }

    const CreateRoomRoute = () => {
        props.navigation.navigate('CreateRoom');
    }

    const JoinRoomRoute = () => {
        props.navigation.navigate('JoinRoom');
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.background}>
                <View style={styles.margin} />
                <HomeButtonLarge text={"Create a Room"} icon={"create-outline"} onPress={CreateRoomRoute} />
                <HomeButtonLarge text={"Join a Room"} icon={"add-outline"} onPress={JoinRoomRoute} />
                <View style={styles.smallButtonContainer}>
                    <HomeButtonAvatar avatar={avatarCopy} onPress={AvatarButtonHandler} />
                    <HomeButtonSmall text={"About"} icon={"information-circle-outline"} />
                </View>
            </ImageBackground>
        </View>
    );
};

export default HomePage;