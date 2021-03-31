import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import TextStyles from '../../theme/text-styles';
import { ButtonStyles } from '../../theme/component-styles';
import { Button } from 'react-native-paper'
import { init, login, setEnWords } from '../../api/firebaseMethods';

const IntroPage = (props) => {

    const startHandler = () => {
        props.navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={TextStyles.title}>Hidden Papa</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button style={ButtonStyles.mainButton} mode="contained" onPress={startHandler}>
                    Start
                </Button>
            </View>
        </View>
    );
};

export default IntroPage;