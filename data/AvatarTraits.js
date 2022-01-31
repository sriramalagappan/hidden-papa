import { DropdownStyles } from '../theme/component-styles';

export const avatarCategories = [
    'accessory'
    ,'eyebrows'
    ,'eyes'
    ,'facialHair'
    ,'hairColor'
    ,'lipColor'
    ,'mouth'
    ,'body'
    ,'clothing'
    ,'clothingColor'
    ,'skinTone'
    ,'hair'
    ,'hat'
    ,'hatColor'
];

export const avatarTraits = {
    accessory: [
        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Round Glasses', value: 'roundGlasses', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Tiny Glasses', value: 'tinyGlasses', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Shades', value: 'shades', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Face Mask', value: 'faceMask', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Hoop Earrings', value: 'hoopEarrings', textStyle: DropdownStyles.dropdownItemText },
    ],
    eyebrows: [
        { label: 'Raised', value: 'raised', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Left Lowered', value: 'leftLowered', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Serious', value: 'serious', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Angry', value: 'angry', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Concerned', value: 'concerned', textStyle: DropdownStyles.dropdownItemText },
    ],
    eyes: [
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
    ],
    facialHair: [
        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Stubble', value: 'stubble', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Beard', value: 'mediumBeard', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Goatee', value: 'goatee', textStyle: DropdownStyles.dropdownItemText },
    ],
    hairColor: [
        { label: 'Blonde', value: 'blonde', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Black', value: 'black', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Brown', value: 'brown', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Orange', value: 'orange', textStyle: DropdownStyles.dropdownItemText },
        { label: 'White', value: 'white', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Blue', value: 'blue', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Pink', value: 'pink', textStyle: DropdownStyles.dropdownItemText },
    ],
    lipColor: [
        { label: 'Pink', value: 'pink', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Purple', value: 'purple', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Blue', value: 'turqoise', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Green', value: 'green', textStyle: DropdownStyles.dropdownItemText },
    ],
    mouth: [
        { label: 'Smile', value: 'openSmile', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Lips', value: 'lips', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Grin', value: 'grin', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Sad', value: 'sad', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Serious', value: 'serious', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Tongue', value: 'tongue', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Pierced Tongue', value: 'piercedTongue', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Rainbow', value: 'vomitingRainbow', textStyle: DropdownStyles.dropdownItemText },
    ],
    body: [
        { label: 'Male', value: 'chest', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Female', value: 'breasts', textStyle: DropdownStyles.dropdownItemText },
    ],
    clothing: [
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
    ],
    clothingColor: [
        { label: 'Black', value: 'black', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Blue', value: 'blue', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Green', value: 'green', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
        { label: 'White', value: 'white', textStyle: DropdownStyles.dropdownItemText },
    ],
    skinTone: [
        { label: 'Light', value: 'light', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Dark', value: 'black', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Yellow', value: 'yellow', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Orange', value: 'brown', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Brown', value: 'dark', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
    ],
    hair: [
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

    ],
    hat: [
        { label: 'None', value: 'none', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Beanie', value: 'beanie', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Turban', value: 'turban', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Party', value: 'party', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Hijab', value: 'hijab', textStyle: DropdownStyles.dropdownItemText },
    ],
    hatColor: [
        { label: 'Black', value: 'black', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Blue', value: 'blue', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Green', value: 'green', textStyle: DropdownStyles.dropdownItemText },
        { label: 'Red', value: 'red', textStyle: DropdownStyles.dropdownItemText },
        { label: 'White', value: 'white', textStyle: DropdownStyles.dropdownItemText },
    ]
}