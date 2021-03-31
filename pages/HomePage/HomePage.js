import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import TextStyles from '../../theme/text-styles';
import { ButtonStyles } from '../../theme/component-styles';
import { Button } from 'react-native-paper'

const HomePage = () => {

    return (
        <View style={styles.container}>
            <Text>Home Page</Text>
        </View>
    );
};

export default HomePage;