import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    margin: {
        marginBottom: height*.055,
    },
    smallButtonContainer: {
        flex: 1,
        flexDirection: 'row',
    }
})