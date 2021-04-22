import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    revealText: {
        fontFamily: 'bold',
        fontSize: 30,
    },

    subtitle: {
        fontFamily: 'regular',
        fontSize: 20,
        marginTop: height * .15
    },

    roleText: {
        fontFamily: 'bold',
        fontSize: width * .065,
        marginTop: height * .1,
    },

    listContainer: {
        height: height * .4,
        width: width * .8,
        alignItems: 'center'
    },

    screen: {
        width: width,
        height: height,
    },

    smallText: {
        fontFamily: 'thin',
        fontSize: 20,
    },
});