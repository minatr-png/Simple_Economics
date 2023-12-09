import './clsCombo.css';
import { BounceLoader } from 'react-spinners';

const CLSCombo = ({ data, value_field, descrip_field, tabIndex = "", id, onKeyUp }) => {

  const getNextElement = (start_element) => {
    let next_element = start_element;
    while (next_element) {
      next_element = next_element.nextElementSibling;

      if (next_element && window.getComputedStyle(next_element).display !== 'none') {
        return next_element
      }
    }

    return next_element;
  };

  const getPreviousElement = (start_element) => {
    let previous_element = start_element;
    while (previous_element) {
      previous_element = previous_element.previousElementSibling;

      if (previous_element && previous_element.tagName !== 'INPUT' && window.getComputedStyle(previous_element).display !== 'none') {
        return previous_element
      }
    }

    return previous_element;
  };

  const selectElement = (ev) => {
    let current_selection = document.querySelector('#comboData .selected');
    if (current_selection) {
      let value_input = document.getElementById(id);
      value_input.value = current_selection.innerHTML;
      value_input.focus();
      value_input.setAttribute('realvalue', current_selection.getAttribute('value'));

      var enter_key_event = new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true,
        cancelable: true,
        shiftKey: ev.shiftKey
      });

      value_input.dispatchEvent(enter_key_event);
    }
  };

  const _onFocus = (ev) => {
    let combo_element = document.getElementById('comboData');

    //Set position and width
    const parent_element = ev.target.parentElement;
    combo_element.style.top = parent_element.clientHeight + 10 + "px";
    combo_element.style.left = parent_element.querySelector('span').clientWidth + "px";
    combo_element.style.width = parent_element.querySelector('input').clientWidth - 20+ "px"; //-20 to balance with the padding

    //Show combo element
    combo_element.style.display = 'block';
    combo_element.classList.add('slideAnimation');

    //Filter input
    let filter_input = combo_element.getElementsByTagName('input')[0];
    filter_input.focus();

    const _onResize = () => {
      const position_data = ev.target.getBoundingClientRect();
      combo_element.style.left = position_data.left + "px";
      combo_element.style.top = position_data.bottom + "px";
    };

    filter_input.onblur = () => {
      combo_element.classList.remove('slideAnimation');
      combo_element.style.display= 'none';
      window.removeEventListener('resize', _onResize);
    };
    window.addEventListener('resize', _onResize);
  };

  const _onMouseOver = (ev) => {
    let current_selection = document.querySelector('#comboData .selected');
    if (current_selection) current_selection.classList.remove('selected');
    ev.target.classList.add('selected');
  }

  const _onMouseOut = (ev) => {
    ev.target.classList.remove('selected');
  }

  const _onKeyDown = (ev) => {
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      let current_selection = document.querySelector('#comboData .selected');
      if (current_selection) {
        let new_selection = ev.key === 'ArrowUp' ? getPreviousElement(current_selection) : getNextElement(current_selection);

        if(new_selection) {
          current_selection.classList.remove('selected');
          new_selection.classList.add('selected');
        }
      }
      else document.querySelector(`#comboData [order="0"]`).classList.add('selected');

    }
  }

  const _onKeyUp = (ev) => {
    if (ev.key === 'Enter' || ev.key === 'Tab') {
      selectElement(ev);
    }
  }

  const _onInput = (ev) => {
    let any_value = false;
    data.forEach(el => {
      let element_div;
      let current_value = ev.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //Replace is used to normalize and replace to avoid missmatches with accents
      if (el[value_field]) {
        element_div = document.querySelector(`#comboData [value="${el[value_field]}"]`);
        let element_value = el[descrip_field].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (element_value.includes(current_value)) {
          any_value = true;
          element_div.style.display = 'block';
        } else {
          element_div.style.display = 'none';
        }
      } else {
        element_div = document.querySelector('#comboData div[order="0"]');
        if (current_value) {
          element_div.style.display = 'none';
        } else {
          element_div.style.display = 'block';
        }
      }
    });

    if (any_value) {
      let current_selection = document.querySelector('#comboData .selected');
      if(current_selection) current_selection.classList.remove('selected');
      document.querySelector('#comboData div:not([style*="display: none"])').classList.add('selected');
    };
  }

  const getComboElement = ({index, value, description}) => {
    return (
      <div key={index} order={index} value={value || ""} onMouseDown={ev => selectElement(ev)} onMouseOver={ev => _onMouseOver(ev)} onMouseOut={ev => _onMouseOut(ev)}>
        {description}
      </div>
    );
  }

  const combo_data = data.map((el, i) => {
    return getComboElement({index: i, value: el[value_field], description: el[descrip_field]});
  })
  return (
    <>
      <input id={id} onFocus={ev => _onFocus(ev)} onKeyUp={ev => onKeyUp(ev)} tabIndex={tabIndex}></input>
      <span id="comboData" onKeyDown={ev => _onKeyDown(ev)} onKeyUp={ev => _onKeyUp(ev)} onInput={ev => _onInput(ev)}>
        <input></input>
        {combo_data}
      </span>
    </>
  );
}

export default CLSCombo;