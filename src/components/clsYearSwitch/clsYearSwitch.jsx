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
        let years_container = document.querySelector(".yearsContainer");
        
        //Show combo element
        years_container.style.display = 'block';
        years_container.classList.add('slideAnimation');

        document.addEventListener('click', _onOuterClick);
    };

    const _onOuterClick = () => {
        let years_container = document.querySelector('.yearsContainer');
        years_container.classList.remove('slideAnimation');
        years_container.style.display= 'none';
        document.removeEventListener('click', _onOuterClick);
    };

    const getYearElement = ({year, index}) => {
        return (
          <div key={index} onClick={() => setCurrentYear(year)} style={{"--n": index}}>
            {year}
          </div>
        );
    };
    
    const years_elements = years.map((year, i) => {
        return getYearElement({index: i, year: year});
    });

    return (
        <span className="yearSwitchContainer">
            <div onClick={() => modifyCurrentYear(-1)} style={(years[0] === current_year ? {visibility: 'hidden'} : {visibility: 'visible'})}>&lt;</div>
            <div className="mainSwitchBtn" onClick={ev => showYearsPopup(ev.currentTarget)}>
                <div>{current_year}</div>
                <span className="yearsContainer">{years_elements}</span>
            </div>
            <div onClick={() => modifyCurrentYear(1)} style={(this_year === current_year ? {visibility: 'hidden'} : {visibility: 'visible'})}>&gt;</div>
        </span>
    );
}

export default CLSYearSwitch;