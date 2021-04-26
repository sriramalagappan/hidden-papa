import React, { useEffect, useState, useReducer } from 'react';
import { View, Dimensions, InteractionManager } from 'react-native';
import styles from './styles';
import { DropdownStyles } from '../../theme/component-styles';
import * as avatarActions from '../../store/actions/avatar';
import { useDispatch, useSelector } from 'react-redux'
import BigHead from '../../components/BigHead';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../components/Button'
import { useFocusEffect } from '@react-navigation/native';
import Background from '../../components/Background';

const height = Dimensions.get('window').height;

const AvatarPage = (props) => {

    // Redux Store State Variable
    const avatar = useSelector(state => state.avatar.avatar);

    // Stateful Variables
    const [tempAvatar, setTempAvatar] = useState({})
    const [category, setCategory] = useState()
    const [traitItems, setTraitItems] = useState([
        { label: 'Select a trait', value: 'temp', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
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
                        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Round Glasses', value: 'roundGlasses', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Tiny Glasses', value: 'tinyGlasses', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Shades', value: 'shades', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Face Mask', value: 'faceMask', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Hoop Earrings', value: 'hoopEarrings', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'eyebrows': {
                    setTraitItems([
                        { label: 'Raised', value: 'raised', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Left Lowered', value: 'leftLowered', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Serious', value: 'serious', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Angry', value: 'angry', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Concerned', value: 'concerned', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'eyes': {
                    setTraitItems([
                        { label: 'Normal', value: 'normal', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Happy', value: 'happy', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Squint', value: 'squint', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Simple', value: 'simple', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Dizzy', value: 'dizzy', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Wink', value: 'wink', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Hearts', value: 'hearts', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Crazy', value: 'crazy', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Cute', value: 'cute', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Dollars', value: 'dollars', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Stars', value: 'stars', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Cyborg', value: 'cyborg', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Eye Patch', value: 'piratePatch', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'facialHair': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Stubble', value: 'stubble', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Beard', value: 'mediumBeard', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Goatee', value: 'goatee', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'hairColor': {
                    setTraitItems([
                        { label: 'Blonde', value: 'blonde', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Black', value: 'black', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Brown', value: 'brown', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Orange', value: 'orange', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'White', value: 'white', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Blue', value: 'blue', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Pink', value: 'pink', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'lipColor': {
                    setTraitItems([
                        { label: 'Pink', value: 'pink', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Purple', value: 'purple', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Blue', value: 'turqoise', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Green', value: 'green', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'mouth': {
                    setTraitItems([
                        { label: 'Smile', value: 'openSmile', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Lips', value: 'lips', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Grin', value: 'grin', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Sad', value: 'sad', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Serious', value: 'serious', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Tongue', value: 'tongue', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Pierced Tongue', value: 'piercedTongue', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Rainbow', value: 'vomitingRainbow', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'body': {
                    setTraitItems([
                        { label: 'Male', value: 'chest', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Female', value: 'breasts', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'clothing': {
                    setTraitItems([
                        { label: 'Shirt', value: 'shirt', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Naked', value: 'naked', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Dress Shirt', value: 'dressShirt', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'V-Neck', value: 'vneck', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Tank Top', value: 'tankTop', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Dress', value: 'dress', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Denim Jacket', value: 'denimJacket', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Chequered Shirt', value: 'chequeredShirt', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Chequered Shirt Dark', value: 'chequeredShirtDark', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Hoodie', value: 'hoodie', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }
            
                case 'clothingColor': {
                    setTraitItems([
                        { label: 'Black', value: 'black', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Blue', value: 'blue', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Green', value: 'green', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'White', value: 'white', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'skinTone': {
                    setTraitItems([
                        { label: 'Light', value: 'light', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Dark', value: 'black', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Yellow', value: 'yellow', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Orange', value: 'brown', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Brown', value: 'dark', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'hair': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Long', value: 'long', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Bun', value: 'bun', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Short', value: 'short', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Pixie', value: 'pixie', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Balding', value: 'balding', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Buzz', value: 'buzz', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Afro', value: 'afro', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Bob', value: 'bob', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Mohawk', value: 'mohawk', textStyle: DropdownStyles.dropdownItemText },

                    ]);
                    break;
                }

                case 'hat': {
                    setTraitItems([
                        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Beanie', value: 'beanie', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Turban', value: 'turban', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Party', value: 'party', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Hijab', value: 'hijab', textStyle: DropdownStyles.dropdownItemText },
                    ]);
                    break;
                }

                case 'hatColor': {
                    setTraitItems([
                        { label: 'Black', value: 'black', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Blue', value: 'blue', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Green', value: 'green', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
                        { label: 'White', value: 'white', textStyle: DropdownStyles.dropdownItemText },
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
        { label: 'Face', value: 'face', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
        { label: 'Accessory', value: 'accessory', parent: 'face', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Eyebrows', value: 'eyebrows', parent: 'face', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Eyes', value: 'eyes', parent: 'face', textStyle: DropdownStyles.dropdownItemText },
        //{ label: 'Lashes', value: 'lashes', parent: 'face', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Mouth', value: 'mouth', parent: 'face', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Lip Color', value: 'lipColor', parent: 'face', textStyle: DropdownStyles.dropdownItemText },

        { label: 'Body', value: 'bodyParent', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
        { label: 'Body Type', value: 'body', parent: 'bodyParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Clothing', value: 'clothing', parent: 'bodyParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Clothing Color', value: 'clothingColor', parent: 'bodyParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Skin Tone', value: 'skinTone', parent: 'bodyParent', textStyle: DropdownStyles.dropdownItemText },

        { label: 'Hair / Hat', value: 'hairParent', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
        { label: 'Hair Type', value: 'hair', parent: 'hairParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Facial Hair', value: 'facialHair', parent: 'hairParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Hair Color', value: 'hairColor', parent: 'hairParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Hat', value: 'hat', parent: 'hairParent', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Hat Color', value: 'hatColor', parent: 'hairParent', textStyle: DropdownStyles.dropdownItemText },
    ];

    return (
        <View style={styles.container}>
            <Background justify={false}>
                <View style={styles.bigHeadContainer}>
                    <BigHead avatar={tempAvatar} size={250} />
                </View>
                <View style={styles.editContainer}>
                    <View style={styles.dropdownContainer}>
                        <DropDownPicker
                            items={categoryItems}
                            containerStyle={styles.dropdownStyle}
                            style={DropdownStyles.primaryDropdown}
                            itemStyle={DropdownStyles.dropdownItem}
                            dropDownStyle={DropdownStyles.dropdownItemContainer}
                            onChangeItem={item => setCategory(item.value)}
                            globalTextStyle={DropdownStyles.dropdownSelectedText}
                            placeholder={"Select a category"}
                            dropDownMaxHeight={height * .25}
                            activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                        />
                        <DropDownPicker
                            items={traitItems}
                            defaultValue={defaultTrait}
                            containerStyle={styles.dropdownStyle}
                            style={DropdownStyles.primaryDropdown}
                            itemStyle={DropdownStyles.dropdownItem}
                            dropDownStyle={DropdownStyles.dropdownItemContainer}
                            onChangeItem={item => updateAvatar(item)}
                            globalTextStyle={DropdownStyles.dropdownSelectedText}
                            placeholder={"Select a trait"}
                            dropDownMaxHeight={height * .25}
                            activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button onPress={saveAvatar} border={true}>Save</Button>
                    </View>
                </View>
            </Background>
        </View>
    );
};

export default AvatarPage;