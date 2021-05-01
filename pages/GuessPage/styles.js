import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    countdown: {
        fontFamily: 'bold',
        fontSize: 75,
    },
    digitStyle: {
        backgroundColor: colors.primary_light
    },
    digitTextStyle: {
        color: 'black',
        fontFamily: 'bold',
    },
    countdownContainer: {
        marginTop: height * .075,
    },
    inputContainer: {
        marginTop: height * .2,
    },
    screen: {
        width,
        height,
        alignItems: 'center',
    }
});