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

    // modal styles

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
    },
    boldText: {
        fontFamily: 'bold',
        fontSize: 25,
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
    textInput: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'thin',
        flex: 1,
        textAlignVertical: 'top'
    },
    largeInputContainer: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
        width: width * .75,
        height: height * .35,
        padding: 5,
    }
});