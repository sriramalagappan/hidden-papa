import React, { useEffect, useState, useReducer } from 'react';
import { View, Dimensions, InteractionManager } from 'react-native';
import styles from './styles';
import { DropdownStyles } from '../../theme/component-styles';
import * as avatarActions from '../../store/actions/avatar';
import { useDispatch, useSelector } from 'react-redux'
import BigHead from '../../components/BigHead';
import DropDownPicker from 'react-native-dropdown-picker';
import SmallButton from '../../components/SmallButton'
import { useFocusEffect } from '@react-navigation/native';
import Background from '../../components/Background';
import { avatarCategories, avatarTraits } from '../../data/AvatarTraits';

const height = Dimensions.get('window').height;

const AvatarPage = (props) => {

    // Redux Store State Variable
    const avatar = useSelector(state => state.avatar.avatar);

    // Stateful Variables
    const [tempAvatar, setTempAvatar] = useState({})
    const [category, setCategory] = useState()
    const [traitItems, setTraitItems] = useState([
        { label: 'Select a category', value: 'temp', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
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
            if (category) {
                setTraitItems(avatarTraits[category]);
            }
            setDefaultTrait(tempAvatar[category]);
        } catch (err) {
            console.log(err)
        }
    }, [category]);

    // update function for temp avatar
    const updateAvatar = (trait) => {
        let newAvatar = tempAvatar;
        newAvatar[category] = trait.value;
        setTempAvatar(newAvatar);
        forceUpdate();
    }

    const randomizeAvatar = () => {
        let newAvatar = tempAvatar;
        // loop for each category
        for (let i = 0; i < avatarCategories.length; i++) {
            // select a random trait and assign it
            const category = avatarCategories[i];
            const traits = avatarTraits[category];
            const randomTrait = traits[Math.floor(Math.random() * traits.length)].value;
            newAvatar[category] = randomTrait;
        }
        setTempAvatar(newAvatar);
        setCategory(null);
        setTraitItems([{ label: 'Select a category', value: 'temp', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle }]);
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
                            placeholder={"Category"}
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
                            placeholder={"Trait"}
                            dropDownMaxHeight={height * .25}
                            activeLabelStyle={DropdownStyles.dropdownSelectedItem}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <SmallButton onPress={randomizeAvatar} border={true}>Random</SmallButton>
                        <SmallButton onPress={saveAvatar} border={true}>Save</SmallButton>
                    </View>
                </View>
            </Background>
        </View>
    );
};

export default AvatarPage;