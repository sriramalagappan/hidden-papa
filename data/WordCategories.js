import { DropdownStyles } from '../theme/component-styles';

export const enWordCategories = [
    { label: 'Basic Word Packs', value: 'default', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
    { label: 'Animal', value: 'animal', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Famous People', value: 'famous-person', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Food', value: 'food', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Geography', value: 'geography', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Pop Culture', value: 'pop-culture', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Profession', value: 'profession', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Sports', value: 'sports', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
    { label: 'Transportation', value: 'transportation', parent: 'default', textStyle: DropdownStyles.dropdownItemText },
]

export const defaultENWordCategories = [
    'animal',
    'famous-person', 
    'food',
    'geography',
    'pop-culture',
    'profession',
    'sports',
    'transportation',
]