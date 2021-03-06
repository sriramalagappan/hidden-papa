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
    countdownContainer: {
        marginTop: height * .05,
    },
    inputContainer: {
        marginTop: height * .25,
        alignItems: 'center',
    },
    screen: {
        width,
        height,
        alignItems: 'center',
    },
    settingsContainer: {
        position: 'absolute',
        top: height * .05,
        left: width * .05,
    },
    guessesIconContainer: {
        position: 'absolute',
        top: height * .055,
        right: width * .05,
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
        borderTopWidth: 3,
        width: width,
        alignItems: 'center',
        backgroundColor: colors.primary_light,
        position: 'absolute',
        top: height * .6,
        ...Platform.select({
            ios: {
                height: height * .4,
            },
            android: {
                height: height * .44,
            },
        }),
    },
    bodyContainerTop: {
        width, 
        height: height * .3,
    },
    bodyContainerBottom: {
        width, 
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
    readyIcon: {
        position: 'absolute',
        right: width * .01,
        top: height * .01,
        zIndex: 99,
    },
    playersContainer: {
        alignItems: 'center',
        marginTop: height * .025,
    },
    buttonContainer: {
        width,
        alignItems:'center',
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

    modalBodyGuesses: {
        ...Platform.select({
            ios: {
                padding: 10,
            },
            android: {
                padding: 24,
            },
        }),
        alignItems: 'center',
        height: height * .75,
        width: width * .8,
    },

    modalBodyNoGuesses: {
        ...Platform.select({
            ios: {
                padding: 10,
            },
            android: {
                padding: 24,
            },
        }),
        alignItems: 'center',
        height: height * .75,
        justifyContent: 'center',
        width: width * .8,
    },

    modalTitle: {
        fontFamily: 'regular',
        fontSize: 15,
    },
    row: {
        flexDirection: 'row'
    },
    wordContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    wordTextBold: {
        fontFamily: 'bold',
        fontSize: width * .06,
        marginTop: height * .025,
        textAlign: 'center',
    },
    wordTextLight: {
        fontFamily: 'regular',
        fontSize: width * .06,
        marginTop: height * .025,
        textAlign: 'center',
    },
});