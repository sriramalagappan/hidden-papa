import React, { useEffect } from 'react';
import { View, ImageBackground } from 'react-native';
import styles from './styles';
import HomeButtonLarge from '../../components/HomeButtonLarge'
import HomeButtonSmall from '../../components/HomeButtonSmall'
import HomeButtonAvatar from '../../components/HomeButtonAvatar'
import { ImageStyles } from '../../theme/component-styles';
import * as avatarActions from '../../store/actions/avatar';
import { useDispatch, useSelector } from 'react-redux'


const image = require('../../assets/Background.png')

const HomePage = (props) => {

    // Redux Store State Variable
    const avatar = useSelector(state => state.avatar.avatar);

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // componentDidMount
    useEffect(() => {
        const getAvatar = async () => {
            await dispatch(avatarActions.getAvatar());
        }
        // only fetch is it hasn't loaded already
        if (!avatar) {
            getAvatar();
        }
    }, [])

    // const AvatarButtonHandler = () => {
    //     props.navigation.naviate()
    // }

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.background}>
                <View style={styles.margin} />
                <HomeButtonLarge text={"Create a Room"} icon={"create-outline"} onPress={() => { console.log('hi') }} />
                <HomeButtonLarge text={"Join a Room"} icon={"add-outline"} />
                <View style={styles.smallButtonContainer}>
                    <HomeButtonAvatar avatar={avatar} />
                    <HomeButtonSmall text={"About"} icon={"information-circle-outline"} />
                </View>
            </ImageBackground>
        </View>
    );
};

export default HomePage;