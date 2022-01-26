import React, { useEffect, useCallback, useState } from 'react';
import { View, InteractionManager } from 'react-native';
import styles from './styles';
import HomeButtonLarge from '../../components/HomeButtonLarge'
import HomeButtonSmall from '../../components/HomeButtonSmall'
import HomeButtonAvatar from '../../components/HomeButtonAvatar'
import * as avatarActions from '../../store/actions/avatar';
import * as roomActions from '../../store/actions/room';
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import Background from '../../components/Background';

const HomePage = (props) => {

    // #region Variables

    // Redux Store State Variable
    const avatar = useSelector(state => state.avatar.avatar);

    // Stateful Variables
    const [avatarCopy, setAvatarCopy] = useState({}) // used for performance
    const [isLoading, setIsLoading] = useState(true)

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // #endregion

    // #region UseEffect

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

    // #endregion

    // #region Functions

    const AvatarPageRoute = () => {
        props.navigation.navigate('Avatar');
    }

    const CreateRoomRoute = () => {
        props.navigation.navigate('CreateRoom');
    }

    const JoinRoomRoute = () => {
        props.navigation.navigate('JoinRoom');
    }

    const SettingsPageRoute = () => {
        props.navigation.navigate('Settings');
    }

    // #endregion

    // #region UI

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <View style={styles.margin} />
                <HomeButtonLarge text={"Create a Room"} icon={"create-outline"} onPress={CreateRoomRoute} />
                <HomeButtonLarge text={"Join a Room"} icon={"add-outline"} onPress={JoinRoomRoute} />
                <View style={styles.smallButtonContainer}>
                    <HomeButtonAvatar avatar={avatarCopy} onPress={AvatarPageRoute} />
                    <HomeButtonSmall text={"Settings"} icon={"settings"} onPress={SettingsPageRoute} />
                </View>
            </Background>
        </View>
    );

    // #endregion
};

export default HomePage;