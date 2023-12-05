import './clsCombo.css';

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
    let current_selection = combo_div.querySelector('.selected');
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
      combo_div.style.display = 'none';

      value_input.dispatchEvent(enter_key_event);
    }
  };

  let combo_div;
  const _onFocus = (ev) => {
    combo_div = document.createElement('div');
    combo_div.id = 'comboData';

    //Filter input
    let filter_input = document.createElement('input');
    filter_input.tabIndex = tabIndex;
    filter_input.onkeydown = ev => _onKeyDown(ev);
    filter_input.onkeyup = ev => _onKeyUp(ev);
    filter_input.oninput = ev => _onInput(ev);
    combo_div.append(filter_input);

    //Add data element
    data.forEach((el, index) => {
      let element_div = document.createElement('div');
      element_div.setAttribute('order', index);
      element_div.setAttribute('value', el[value_field]);
      element_div.append(el[descrip_field]);
      element_div.onmousedown = ev => selectElement(ev);
      element_div.onmouseover = ev => _onMouseOver(ev);
      element_div.onmouseout = ev => _onMouseOut(ev);
      combo_div.append(element_div);
    });

    //Set position and width
    const position_data = ev.target.getBoundingClientRect();
    combo_div.style.position = 'absolute';
    combo_div.style.top = (position_data.top + position_data.height + 10) + "px";
    combo_div.style.left = position_data.left + "px";
    combo_div.style.width = position_data.width + "px";

    document.body.append(combo_div);
    combo_div.classList.add('visible');
    filter_input.focus();

    const _onResize = () => {
      const position_data = ev.target.getBoundingClientRect();
      combo_div.style.left = position_data.left + "px";
      combo_div.style.top = position_data.bottom + "px";

      console.log('Hola')
    };

    filter_input.onblur = () => {
      combo_div.remove();
      window.removeEventListener('resize', _onResize);
    };
    window.addEventListener('resize', _onResize);
  };

  const _onMouseOver = (ev) => {
    let current_selection = combo_div.querySelector('.selected');
    if (current_selection) current_selection.classList.remove('selected');
    ev.target.classList.add('selected');
  }

  const _onMouseOut = (ev) => {
    ev.target.classList.remove('selected');
  }

  const _onKeyDown = (ev) => {
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      let current_selection = combo_div.querySelector('.selected');
      if (current_selection) {
        let new_selection = ev.key === 'ArrowUp' ? getPreviousElement(current_selection) : getNextElement(current_selection);

        if(new_selection) {
          current_selection.classList.remove('selected');
          new_selection.classList.add('selected');
        }
      }
      else combo_div.querySelector(`[order="0"]`).classList.add('selected');

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
      let element_div = combo_div.querySelector(`[value="${el[value_field]}"]`);
      let current_value = ev.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");   //Normalize and replace to avoid missmatches with accents
      let element_value = el[descrip_field].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (element_value.includes(current_value)) {
        any_value = true;
        element_div.style.display = 'block';
      } else {
        element_div.style.display = 'none';
      }
    });

    if (any_value) {
      let current_selection = combo_div.querySelector('.selected');
      if(current_selection) current_selection.classList.remove('selected');
      combo_div.querySelector('div:not([style*="display: none"])').classList.add('selected');
    };
  }

  return (
    <input id={id} onFocus={ev => _onFocus(ev)} onKeyUp={ev => { onKeyUp(ev); }} tabIndex={tabIndex}></input>
  );
}

export default CLSCombo;