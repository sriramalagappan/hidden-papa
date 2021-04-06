import React, { useEffect, useState, useReducer } from 'react';
import { View, ImageBackground, Dimensions, InteractionManager } from 'react-native';
import styles from './styles';
import { ImageStyles } from '../../theme/component-styles';
import * as avatarActions from '../../store/actions/avatar';
import { useDispatch, useSelector } from 'react-redux'
import BigHead from '../../components/BigHead';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../components/Button'
import colors from '../../theme/colors'
import { useFocusEffect } from '@react-navigation/native';


const height = Dimensions.get('window').height;

const image = require('../../assets/Background.png')

const AvatarPage = (props) => {

    // Redux Store State Variable
    const avatar = useSelector(state => state.avatar.avatar);

    // Stateful Variables
    const [tempAvatar, setTempAvatar] = useState({})
    const [category, setCategory] = useState()
    const [traitItems, setTraitItems] = useState([
        { label: 'Select a trait', value: 'temp', untouchable: true, textStyle: styles.dropdownCategoryTitle },
    ])
    const [defaultTrait, setDefaultTrait] = useState('temp')

    // used to force update
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    // store dispatch function in variable to use elsewhere
    const dispatch = useDispatch()

    // componentDidMount
    useFocusEffect(
        React.useCallback(() => {

            const getAvatar = async () => {
                await dispatch(avatarActions.getAvatar());
            }

            InteractionManager.runAfterInteractions(() => {
                getAvatar()
                setTempAvatar(avatar)
            });

            return () => {
            };
        }, [])
    );

    // update traitItems depending on category selected
    useEffect(() => {
        try {
            switch (category) {
                case 'accessory': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: styles.dropdownItemText },
                        { label: 'Round Glasses', value: 'roundGlasses', textStyle: styles.dropdownItemText },
                        { label: 'Tiny Glasses', value: 'tinyGlasses', textStyle: styles.dropdownItemText },
                        { label: 'Shades', value: 'shades', textStyle: styles.dropdownItemText },
                        { label: 'Face Mask', value: 'faceMask', textStyle: styles.dropdownItemText },
                        { label: 'Hoop Earrings', value: 'hoopEarrings', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'eyebrows': {
                    setTraitItems([
                        { label: 'Raised', value: 'raised', textStyle: styles.dropdownItemText },
                        { label: 'Left Lowered', value: 'leftLowered', textStyle: styles.dropdownItemText },
                        { label: 'Serious', value: 'serious', textStyle: styles.dropdownItemText },
                        { label: 'Angry', value: 'angry', textStyle: styles.dropdownItemText },
                        { label: 'Concerned', value: 'concerned', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'eyes': {
                    setTraitItems([
                        { label: 'Normal', value: 'normal', textStyle: styles.dropdownItemText },
                        { label: 'Happy', value: 'happy', textStyle: styles.dropdownItemText },
                        { label: 'Squint', value: 'squint', textStyle: styles.dropdownItemText },
                        { label: 'Simple', value: 'simple', textStyle: styles.dropdownItemText },
                        { label: 'Dizzy', value: 'dizzy', textStyle: styles.dropdownItemText },
                        { label: 'Wink', value: 'wink', textStyle: styles.dropdownItemText },
                        { label: 'Hearts', value: 'hearts', textStyle: styles.dropdownItemText },
                        { label: 'Crazy', value: 'crazy', textStyle: styles.dropdownItemText },
                        { label: 'Cute', value: 'cute', textStyle: styles.dropdownItemText },
                        { label: 'Dollars', value: 'dollars', textStyle: styles.dropdownItemText },
                        { label: 'Stars', value: 'stars', textStyle: styles.dropdownItemText },
                        { label: 'Cyborg', value: 'cyborg', textStyle: styles.dropdownItemText },
                        { label: 'Eye Patch', value: 'piratePatch', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'facialHair': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: styles.dropdownItemText },
                        { label: 'Stubble', value: 'stubble', textStyle: styles.dropdownItemText },
                        { label: 'Beard', value: 'mediumBeard', textStyle: styles.dropdownItemText },
                        { label: 'Goatee', value: 'goatee', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'hairColor': {
                    setTraitItems([
                        { label: 'Blonde', value: 'blonde', textStyle: styles.dropdownItemText },
                        { label: 'Black', value: 'black', textStyle: styles.dropdownItemText },
                        { label: 'Brown', value: 'brown', textStyle: styles.dropdownItemText },
                        { label: 'Orange', value: 'orange', textStyle: styles.dropdownItemText },
                        { label: 'White', value: 'white', textStyle: styles.dropdownItemText },
                        { label: 'Blue', value: 'blue', textStyle: styles.dropdownItemText },
                        { label: 'Pink', value: 'pink', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'lipColor': {
                    setTraitItems([
                        { label: 'Pink', value: 'pink', textStyle: styles.dropdownItemText },
                        { label: 'Purple', value: 'purple', textStyle: styles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: styles.dropdownItemText },
                        { label: 'Blue', value: 'turqoise', textStyle: styles.dropdownItemText },
                        { label: 'Green', value: 'green', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'mouth': {
                    setTraitItems([
                        { label: 'Smile', value: 'openSmile', textStyle: styles.dropdownItemText },
                        { label: 'Lips', value: 'lips', textStyle: styles.dropdownItemText },
                        { label: 'Grin', value: 'grin', textStyle: styles.dropdownItemText },
                        { label: 'Sad', value: 'sad', textStyle: styles.dropdownItemText },
                        { label: 'Serious', value: 'serious', textStyle: styles.dropdownItemText },
                        { label: 'Tongue', value: 'tongue', textStyle: styles.dropdownItemText },
                        { label: 'Pierced Tongue', value: 'piercedTongue', textStyle: styles.dropdownItemText },
                        { label: 'Rainbow', value: 'vomitingRainbow', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'body': {
                    setTraitItems([
                        { label: 'Male', value: 'chest', textStyle: styles.dropdownItemText },
                        { label: 'Female', value: 'breasts', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'clothing': {
                    setTraitItems([
                        { label: 'Shirt', value: 'shirt', textStyle: styles.dropdownItemText },
                        { label: 'Naked', value: 'naked', textStyle: styles.dropdownItemText },
                        { label: 'Dress Shirt', value: 'dressShirt', textStyle: styles.dropdownItemText },
                        { label: 'V-Neck', value: 'vneck', textStyle: styles.dropdownItemText },
                        { label: 'Tank Top', value: 'tankTop', textStyle: styles.dropdownItemText },
                        { label: 'Dress', value: 'dress', textStyle: styles.dropdownItemText },
                        { label: 'Denim Jacket', value: 'denimJacket', textStyle: styles.dropdownItemText },
                        { label: 'Chequered Shirt', value: 'chequeredShirt', textStyle: styles.dropdownItemText },
                        { label: 'Chequered Shirt Dark', value: 'chequeredShirtDark', textStyle: styles.dropdownItemText },
                        { label: 'Hoodie', value: 'hoodie', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }
            
                case 'clothingColor': {
                    setTraitItems([
                        { label: 'Black', value: 'black', textStyle: styles.dropdownItemText },
                        { label: 'Blue', value: 'blue', textStyle: styles.dropdownItemText },
                        { label: 'Green', value: 'green', textStyle: styles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: styles.dropdownItemText },
                        { label: 'White', value: 'white', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'skinTone': {
                    setTraitItems([
                        { label: 'Light', value: 'light', textStyle: styles.dropdownItemText },
                        { label: 'Black', value: 'black', textStyle: styles.dropdownItemText },
                        { label: 'Yellow', value: 'yellow', textStyle: styles.dropdownItemText },
                        { label: 'Orange', value: 'brown', textStyle: styles.dropdownItemText },
                        { label: 'Brown', value: 'dark', textStyle: styles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'hair': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: styles.dropdownItemText },
                        { label: 'Long', value: 'long', textStyle: styles.dropdownItemText },
                        { label: 'Bun', value: 'bun', textStyle: styles.dropdownItemText },
                        { label: 'Short', value: 'short', textStyle: styles.dropdownItemText },
                        { label: 'Pixie', value: 'pixie', textStyle: styles.dropdownItemText },
                        { label: 'Balding', value: 'balding', textStyle: styles.dropdownItemText },
                        { label: 'Buzz', value: 'buzz', textStyle: styles.dropdownItemText },
                        { label: 'Afro', value: 'afro', textStyle: styles.dropdownItemText },
                        { label: 'Bob', value: 'bob', textStyle: styles.dropdownItemText },
                        { label: 'Mohawk', value: 'mohawk', textStyle: styles.dropdownItemText },

                    ]);
                    break;
                }

                case 'hat': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: styles.dropdownItemText },
                        { label: 'Beanie', value: 'beanie', textStyle: styles.dropdownItemText },
                        { label: 'Turban', value: 'turban', textStyle: styles.dropdownItemText },
                        { label: 'Party', value: 'party', textStyle: styles.dropdownItemText },
                        { label: 'Hijab', value: 'hijab', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }

                case 'hatColor': {
                    setTraitItems([
                        { label: 'Black', value: 'black', textStyle: styles.dropdownItemText },
                        { label: 'Blue', value: 'blue', textStyle: styles.dropdownItemText },
                        { label: 'Green', value: 'green', textStyle: styles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: styles.dropdownItemText },
                        { label: 'White', value: 'white', textStyle: styles.dropdownItemText },
                    ]);
                    break;
                }
            }
            setDefaultTrait(tempAvatar[category])
        } catch (err) {
            console.log(err)
        }
    }, [category])

    // update function for temp avatar
    const updateAvatar = (trait) => {
        let newAvatar = tempAvatar
        newAvatar[category] = trait.value
        setTempAvatar(newAvatar)
        forceUpdate();
    }

    // save avatar
    const saveAvatar = () => {
        dispatch(avatarActions.saveAvatar(tempAvatar))
    }

    const categoryItems = [
        { label: 'Face', value: 'face', untouchable: true, textStyle: styles.dropdownCategoryTitle },
        { label: 'Accessory', value: 'accessory', parent: 'face', textStyle: styles.dropdownItemText },
        { label: 'Eyebrows', value: 'eyebrows', parent: 'face', textStyle: styles.dropdownItemText },
        { label: 'Eyes', value: 'eyes', parent: 'face', textStyle: styles.dropdownItemText },
        //{ label: 'Lashes', value: 'lashes', parent: 'face', textStyle: styles.dropdownItemText },
        { label: 'Mouth', value: 'mouth', parent: 'face', textStyle: styles.dropdownItemText },
        { label: 'Lip Color', value: 'lipColor', parent: 'face', textStyle: styles.dropdownItemText },

        { label: 'Body', value: 'bodyParent', untouchable: true, textStyle: styles.dropdownCategoryTitle },
        { label: 'Body Type', value: 'body', parent: 'bodyParent', textStyle: styles.dropdownItemText },
        { label: 'Clothing', value: 'clothing', parent: 'bodyParent', textStyle: styles.dropdownItemText },
        { label: 'Clothing Color', value: 'clothingColor', parent: 'bodyParent', textStyle: styles.dropdownItemText },
        { label: 'Skin Tone', value: 'skinTone', parent: 'bodyParent', textStyle: styles.dropdownItemText },

        { label: 'Hair / Hat', value: 'hairParent', untouchable: true, textStyle: styles.dropdownCategoryTitle },
        { label: 'Hair Type', value: 'hair', parent: 'hairParent', textStyle: styles.dropdownItemText },
        { label: 'Facial Hair', value: 'facialHair', parent: 'hairParent', textStyle: styles.dropdownItemText },
        { label: 'Hair Color', value: 'hairColor', parent: 'hairParent', textStyle: styles.dropdownItemText },
        { label: 'Hat', value: 'hat', parent: 'hairParent', textStyle: styles.dropdownItemText },
        { label: 'Hat Color', value: 'hatColor', parent: 'hairParent', textStyle: styles.dropdownItemText },
    ];

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={ImageStyles.backgroundNoJustify}>
                <View style={styles.bigHeadContainer}>
                    <BigHead avatar={tempAvatar} size={250} />
                </View>
                <View style={styles.editContainer}>
                    <View style={styles.dropdownContainer}>
                        <DropDownPicker
                            items={categoryItems}
                            containerStyle={styles.dropdownStyle}
                            style={styles.primaryDropdown}
                            itemStyle={styles.dropdownItem}
                            dropDownStyle={styles.dropdownItemContainer}
                            onChangeItem={item => setCategory(item.value)}
                            globalTextStyle={styles.dropdownSelectedText}
                            placeholder={"Select a category"}
                            dropDownMaxHeight={height * .3}
                            activeLabelStyle={styles.dropdownSelectedItem}
                        />
                        <DropDownPicker
                            items={traitItems}
                            defaultValue={defaultTrait}
                            containerStyle={styles.dropdownStyle}
                            style={styles.primaryDropdown}
                            itemStyle={styles.dropdownItem}
                            dropDownStyle={styles.dropdownItemContainer}
                            onChangeItem={item => updateAvatar(item)}
                            globalTextStyle={styles.dropdownSelectedText}
                            placeholder={"Select a trait"}
                            dropDownMaxHeight={height * .3}
                            activeLabelStyle={styles.dropdownSelectedItem}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button onPress={saveAvatar} border={true}>Save</Button>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default AvatarPage;