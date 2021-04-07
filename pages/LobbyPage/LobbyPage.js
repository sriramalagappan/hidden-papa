import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Dimensions, Alert } from 'react-native';
import styles from './styles';
import { ImageStyles, DropdownStyles } from '../../theme/component-styles';
import Button from '../../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import Input from '../../components/Input';
import { init, login, createRoom, isCodeUnique } from '../../api/firebaseMethods';
import * as roomActions from '../../store/actions/room';

const height = Dimensions.get('window').height;

const image = require('../../assets/Background.png')

const CreateRoomPage = (props) => {

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // Redux Store-State Variables
    const roomCode = useSelector(state => state.room.roomCode)

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
            </ImageBackground>
        </View>
    );
};

export default CreateRoomPage;