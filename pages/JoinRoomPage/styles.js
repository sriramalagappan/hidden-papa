import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    keyboardDismiss: {
        width,
        height: height * .3,
    },
    inputContainer: {
        alignItems: 'center',
        width: '100%',
    },
    dropdownContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: height * .05,
    },
    dropdownStyle: {
        height: height * .06,
        width: '75%',
    },
    primaryDropdown: {
        backgroundColor: colors.primary_light, 
        borderColor: 'black',
        borderWidth: 0,
    },
    buttonContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: height * .025,
    },
    roomCodeContainer: {
        alignItems: 'center',
        width: '100%',
        //marginTop: height * .04,
    },
    text: {
        color: '#282828',
        fontSize: 18,
        fontFamily: 'thin',
    },
    inputText: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'bold',
    },
    idleBottomRight: {
        width: width * 1.25,
        position: 'absolute',
        left: -width * 0.275,
        top: height * .01,
    },
    idleTopLeft: {
        width: width * 1.25,
        position: 'absolute',
        right: -width * 0.275,
        bottom: 0,
    }
})