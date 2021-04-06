import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import colors from '../theme/colors';
import { BigHead } from 'react-native-bigheads'

const BigHeadComponent = (props) => {
    if (props.avatar && Object.keys(props.avatar).length !== 0) {
        return (
            <BigHead
                accessory={props.avatar.accessory}
                bgColor={colors.primary}
                bgShape="square"
                body={props.avatar.body}
                clothing={props.avatar.clothing}
                clothingColor={props.avatar.clothingColor}
                eyebrows={props.avatar.eyebrows}
                eyes={props.avatar.eyes}
                facialHair={props.avatar.facialHair}
                graphic={props.avatar.graphic}
                hair={props.avatar.hair}
                hairColor={props.avatar.hairColor}
                hat={props.avatar.hat}
                hatColor={props.avatar.hatColor}
                lashes={props.avatar.lashes}
                lipColor={props.avatar.lipColor}
                mouth={props.avatar.mouth}
                showBackground={true}
                size={props.size}
                skinTone={props.avatar.skinTone}
            />)
    } else {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={'black'} size={50} />
            </View>
        )
    }
};

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    loadingContainer: {
        marginTop: height * .04,
    }
})

export default BigHeadComponent;