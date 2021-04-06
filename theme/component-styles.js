import { StyleSheet, Dimensions, Button } from 'react-native';
import colors from '../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ButtonStyles = StyleSheet.create({
    mainButton: {
        width: width * .3,
        height: height *.1,
        backgroundColor: colors.primary_light,   
    }
});

const ImageStyles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: width,
        alignItems: 'center',
    },
    backgroundNoJustify: {
        flex: 1,
        resizeMode: 'cover',
        width: width,
        alignItems: 'center',
    }
})

const DropdownStyles = StyleSheet.create({
    primaryDropdown: {
        backgroundColor: colors.primary_light, 
        borderColor: 'black',
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
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
    dropdownSelectedText: {
        fontFamily: 'regular',
        color: 'black',
    },
    dropdownSelectedItem: {
        color: colors.primary,
    }
})

export { ButtonStyles, ImageStyles, DropdownStyles }