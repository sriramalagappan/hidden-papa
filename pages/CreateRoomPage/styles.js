import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    inputContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: height * .1,
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
        marginTop: height * .35,
    }
})