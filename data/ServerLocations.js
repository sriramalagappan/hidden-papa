import { DropdownStyles } from '../theme/component-styles';

const ServerLocations =  [
    { label: 'North America', value: 'na', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
    { label: 'United States', value: 'usa', parent: 'na', textStyle: DropdownStyles.dropdownItemText },

    { label: 'Asia', value: 'asia', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
    { label: 'Korea', value: 'korea', parent: 'asia', textStyle: DropdownStyles.dropdownItemText },

    //{ label: 'More to come soon!', value: 'temp', untouchable: true, textStyle: DropdownStyles.dropdownCategoryTitle },
];

export default ServerLocations