import { StyleSheet, Dimensions, Platform } from 'react-native';
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
    settingsContainer: {
        position: 'absolute',
        top: height * .05,
        left: width * .05,
    },
    toggleWordContainer: {
        position: 'absolute',
        top: height * .05,
    },
    wordContainer: {
        justifyContent: 'center',
        marginTop: height * .05,
    },
    countdownContainer: {
        marginTop: height * .425,
    },
    word: {
        fontFamily: 'regular',
        fontSize: 20,
    },
    guessesIconContainer: {
        position: 'absolute',
        top: height * .0555,
        right: width * .06,
    },
    guessContainer: {
        flexDirection: 'row',
        height: height * .075,
        alignItems: 'center',
        marginTop: height * .01,
        borderBottomWidth: 1,
        width: width * .725,
    },
    guessTextWord: {
        fontFamily: 'bold',
        fontSize: 15,
    },
    guessText: {
        fontFamily: 'regular',
        fontSize: 15,
    },
    guessesListContainer: {
        marginTop: height * .05,
        height: height * .4,
        borderTopWidth: 3,
        width: width,
        alignItems: 'center',
        backgroundColor: colors.primary_light
    },



    modalContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.62)'
    },

    modal: {
        padding: 10,
        ...Platform.select({
            ios: {
                backgroundColor: 'white',
                borderRadius: 10,
                minWidth: 300,
            },
            android: {
                backgroundColor: 'white',
                elevation: 24,
                minWidth: 280,
                borderRadius: 5,
            },
        }),
    },

    modalBody: {
        ...Platform.select({
            ios: {
                padding: 10,
            },
            android: {
                padding: 24,
            },
        }),
        alignItems: 'center'
    },
});