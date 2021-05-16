import React from 'react'
import { View, TextInput, StyleSheet, Text, TextPropTypes, Dimensions } from 'react-native'
import colors from '../theme/colors'

const Input = props => {

    return (
        <View style={styles.outerContainer}>
            <TextInput 
                style={styles.input}
                onChangeText={props.onChangeText}
                value={props.value}
                placeholder={props.placeholder}
                keyboardType={props.keyboardType}
                autoCapitalize={props.autoCapitalize}
                autoCorrect={props.autoCorrect}
                maxLength={props.maxLength}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                textAlign={props.textAlign}
                placeholderTextColor={"#282828"}
                onSubmitEditing={props.onSubmitEditing}
            />
            {props.children}
        </View>
    )
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    outerContainer: {
        marginVertical: 10,
        borderColor: 'black',
        borderBottomWidth: 1,
        width: width * .75,
        height: height * .05,
        justifyContent: 'center',
    },
    input: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'thin',
    }
});

export default Input