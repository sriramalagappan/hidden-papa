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
        textAlign: 'center',
        marginHorizontal: 20,
    },
    roleText: {
        fontFamily: 'bold',
        fontSize: width * .065,
        textAlign: 'center',        
        marginHorizontal: 20,
    },
    screen: {
        width: width,
        height: height,
    },
    smallText: {
        fontFamily: 'thin',
        fontSize: 20,
        textAlign:'center',
        marginHorizontal: 20,
    },
    smallTextMargin: {
        fontFamily: 'thin',
        fontSize: 20,
        marginTop: height * .05,
        marginHorizontal: 20,
        textAlign:'center',
    },
});