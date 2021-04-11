import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    back: {
        justifyContent: 'center',
        position: 'absolute',
        left: 15,
    },
    row: {
        flexDirection: 'row',
        width: width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        marginTop: height * .025,
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
        marginTop: height * .05,
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
    },
    readyIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    msgContainer: {
        marginTop: height * .03
    },

    modalContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.62)'
    },

    modal: {
        marginLeft: 30,
        marginRight: 30,
        ...Platform.select({
            ios: {
                backgroundColor: colors.primary,
                borderRadius: 10,
                minWidth: 300,
            },
            android: {
                backgroundColor: colors.primary,
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

    modalRow: {
        flexDirection: 'row',
    },

    modalMessageContainer: {
        width: width * .7,
    },

    modalMessage: {
        fontFamily: 'regular',
        fontSize: 16,
    }
});