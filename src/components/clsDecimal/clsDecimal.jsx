/*'use client';
import styles from './clsDecimal.module.css';
import PropTypes from 'prop-types';
import CurrencyInput  from 'react-currency-input-field';

let value;
const CLSDecimal = ({placeholder, ref}) => {

    const inpChange = (val) => {
        value = val;
    }

    const getValue = () => {
        return val;
    }

    return (
        <CurrencyInput placeholder={placeholder} onValueChange={inpChange} groupSeparator='.' decimalSeparator=',' suffix='€'></CurrencyInput>
    )
}

CLSDecimal.propTypes = {
    placeholder: PropTypes.string, // Declare the prop as optional
};

CLSDecimal.getValue()

export default CLSDecimal;*/