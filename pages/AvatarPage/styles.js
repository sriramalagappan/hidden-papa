import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    bigHeadContainer: {
        marginTop: 15,
    },
    editContainer: {
        width: '90%',
        height: '100%',
        marginTop: height * .04,
        backgroundColor: colors.primary_light,
        borderRadius: 30,
    },
    dropdownContainer: {
        marginTop: height * .03,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        height: height * .35
    },
    dropdownStyle: {
        height: height * .06,
        width: '45%',
    },
    buttonContainer: {
        marginTop: height * .005,
        alignItems: 'center'
    },
})