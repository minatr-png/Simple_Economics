"use client";
import './clsYearSwitch.css';
import { useState } from 'react';

const CLSYearSwitch = ({default_year = new Date().getFullYear(), years = [], onChange = year => {}}) => {
    const this_year = default_year;
    var [current_year, setYear] = useState(this_year);

    const modifyCurrentYear = (modifier) => {
        setYear(year => year + modifier);
        onChange(current_year + modifier);
    };

    const setCurrentYear = (new_year) => {
        setYear(() => new_year);
        onChange(new_year);
    };

    const showYearsPopup = (input) => {
        if (years.length === 0) return;
        
        let current_years_container = document.querySelector('.yearsContainer');
        if(current_years_container) {
            current_years_container.remove();
            return;
        }

        let years_container = document.createElement('span');
        years_container.classList.add('yearsContainer');

        const position_data = input.getBoundingClientRect();

        years.forEach((year, i) => {
            let element_div = document.createElement('div');
            element_div.append(year);
            element_div.style.setProperty('--n', i);
            element_div.onclick = () => setCurrentYear(year);
            years_container.append(element_div);
        });

        years_container.style.position = 'relative';

        input.append(years_container);
        document.addEventListener('click', _onOuterClick);
    };

    const _onOuterClick = () => {
        let current_years_container = document.querySelector('.yearsContainer');
        if(current_years_container) current_years_container.remove();
        document.removeEventListener('click', _onOuterClick);
    }

    return (
        <span className="yearSwitchContainer">
            <div onClick={() => modifyCurrentYear(-1)} style={(years[0] === current_year ? {visibility: 'hidden'} : {visibility: 'visible'})}>&lt;</div>
            <div className="mainSwitchBtn" onClick={ev => showYearsPopup(ev.currentTarget   )}><div>{current_year}</div></div>
            <div onClick={() => modifyCurrentYear(1)} style={(this_year === current_year ? {visibility: 'hidden'} : {visibility: 'visible'})}>&gt;</div>
        </span>
    );
}

export default CLSYearSwitch;