import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontFamily: 'bold',
        fontSize: width * .1,
        marginTop: height * 0.25//* .05,
    },
    subtitle: {
        fontFamily: 'regular',
        fontSize: width * .06,
        marginTop: height * .025,
    },
    text: {
        flexDirection: 'column',
        marginTop: 35,
        marginLeft: width * .125,
        width: width * .45
    },
    row: {
        flexDirection: 'row',
        width,
    },
    buttonContainer: {
        marginTop: height * 0.1,
    },
    boldText: {
        fontFamily: 'bold',
        fontSize: width * .06,
        marginTop: height * .025,
    }
});