import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    buttonContainer: {
        marginTop: height * .40,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    playersContainer: {
        height: height * .36,
    },
    player: {
        width: width * .23,
        alignItems: 'center',
    },
    playerText: {
        color: 'black',
        fontSize: 13,
        fontFamily: 'thin',
        textAlign: 'center'
    },
    titleContainer: {
        marginTop: height * .075,
        marginBottom: height * .025,
    },
    title: {
        textAlign: 'center',
        fontFamily: 'bold',
        fontSize: 45,
    },
    subtitle: {
        textAlign: 'center',
        fontFamily: 'regular',
        fontSize: 25,
    },
    sideContainer: {
        width: width,
        alignItems: 'flex-start',
        marginTop: height * .03,
    },
    sideButton: {
        width: width * .9,
        height: height * .1,
        backgroundColor: colors.primary_light,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    sideTitle: {
        fontFamily: 'bold',
        fontSize: 25,
        marginLeft: 20,
    },
    isNotReady: {
        fontFamily: 'regular',
        fontSize: 15,
        color: 'black',
    },
    isReady: {
        fontFamily: 'regular',
        fontSize: 15,
        color: colors.green,
    }
});