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
    primaryDropdown: {
        backgroundColor: colors.primary_light, 
        borderColor: 'black',
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    dropdownContainer: {
        marginTop: height * .03,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        height: height * .35
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropdownItemContainer: {
        justifyContent: 'flex-start',
        backgroundColor: '#fafafa', 
        borderColor: '#fafafa',
    },
    dropdownCategoryTitle: {
        fontFamily: 'bold',
        color: 'black',
    },
    dropdownItemText: {
        fontFamily: 'regular',        
        color: 'black',
    },
    dropdownStyle: {
        height: height * .06,
        width: '45%',
    },
    dropdownSelectedText: {
        fontFamily: 'regular',
        color: 'black',
    },
    buttonContainer: {
        marginTop: height * .005,
        alignItems: 'center'
    },
    dropdownSelectedItem: {
        color: colors.primary,
    }
})