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

export { ButtonStyles, ImageStyles }