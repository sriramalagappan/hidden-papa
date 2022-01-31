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
        marginHorizontal: 1,
        //borderRadius: 5,
        //backgroundColor: colors.primary_light
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
        fontSize: width * .1,
    },
    subtitle: {
        textAlign: 'center',
        fontFamily: 'regular',
        fontSize: width * .06,
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
        right: width * .01,
        top: height * .01,
        zIndex: 99,
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

    modalBodyGameSettings: {
        ...Platform.select({
            ios: {
                padding: 10,
                height: height * .8,
                width: width * .8,
                alignItems: 'center',
            },
            android: {
                padding: 24,
                height: height * .8,
                width: width * .8,
                alignItems: 'center',
            },
        }),
        alignItems: 'center',
    },

    modalBodyGameRuleSettings: {
        padding: 15,
        height: height * .8,
        width: width * .8,
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
    },

    modalPlayerText: {
        fontFamily: 'bold',
        fontSize: 25,
        textAlign: 'center'
    },
    marginLrg: {
        marginTop: 20,
    },
    marginSml: {
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: 'white'
    },
    kick: {
        color: 'red',
        fontFamily: 'bold'
    },
    smallText: {
        fontFamily: 'thin',
        fontSize: 15,
    },
    smallTextLeft: {
        fontFamily: 'thin',
        fontSize: 15,
        textAlign: 'left'
    },
    smallTextBold: {
        fontFamily: 'bold',
        fontSize: 15,
        textAlign: 'left'
    },
    dropdownStyle: {
        height: height * .06,
        width: width * .7,
    },
    primaryDropdown: {
        backgroundColor: 'white', 
        borderColor: 'black',
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    loadingSml: {
        marginTop: height * .05,
    }
});