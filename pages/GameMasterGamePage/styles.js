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
        top: width * .075,
        left: height * .03,
    },
    toggleWordContainer: {
        position: 'absolute',
        top: width * .075,
        right: height * .03,
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

    guessesContainer: {
        position: 'absolute',
        bottom: height * .05,
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