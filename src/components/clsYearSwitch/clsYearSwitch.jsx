"use client";
import './clsYearSwitch.css';
import { useState } from 'react';

const CLSYearSwitch = ({years = [], onChange = () => {}}) => {
    var [current_year, setYear] = useState(new Date().getFullYear());

    const modifyCurrentYear = (modifier) => {
        setYear(year => year + modifier);
        onChange();
    };

    const setCurrentYear = (new_year) => {
        setYear(() => new_year);
        onChange();
    };

    const showYearsPopup = (input) => {
        let current_years_container = document.querySelector('.yearsContainer');
        if(current_years_container) {
            current_years_container.remove();
            return;
        }

        let years_container = document.createElement('span');
        years_container.classList.add('yearsContainer');

        years.forEach((year) => {
            let element_div = document.createElement('div');
            element_div.append(year);
            element_div.onclick = () => setCurrentYear(year);
            years_container.append(element_div);
        });

        const position_data = input.getBoundingClientRect();
        years_container.style.position = 'absolute';
        years_container.style.top = (position_data.top + position_data.height + 10) + "px";
        years_container.style.left = position_data.left + "px";
        years_container.style.width = position_data.width + "px";

        input.append(years_container);
    };

    return (
        <span className="yearSwitchContainer">
            <div onClick={() => modifyCurrentYear(-1)}>&lt;</div>
            <div onClick={ev => showYearsPopup(ev.target)}>{current_year}</div>
            <div onClick={() => modifyCurrentYear(1)}>&gt;</div>
        </span>
    );
}

export default CLSYearSwitch;