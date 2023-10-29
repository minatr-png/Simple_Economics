"use client";
import Link from "next/link";
import styles from  './styles.module.css';
import CurrencyInput  from 'react-currency-input-field';
import CLSNavButton from '@clsNavButton';

export default function Page() {
    
    let amount;
    const inpChange = (val) => {            
        amount = val;
    }

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const onEsnterPress = (ev, tabIndex:number) => {
        console.log(ev);
        if (ev.key !== "Enter") return;
        
        if(tabIndex === 2) {
            document.getElementById("SubmitExpense").click();
        } else {
            (document.querySelector(`[tabindex="${tabIndex+1}"]`) as any).focus();
        }
    }
    
    const submitExpense = () => {
        console.log('hola');
    }

    //<CLSDecimal ref={customInputRef} placeholder="0.00€"></CLSDecimal>
    return (
        <div id="moduleContainer" className={styles.economics + " bg-economics"}>
            <div className={styles.inputsGroup}>
                <div>
                    <span>Gasto: </span>
                    <CurrencyInput id="amountInput" placeholder="0.00€" onValueChange={inpChange} groupSeparator='.' decimalSeparator=',' suffix='€' 
                        onKeyUp={(ev) => onEsnterPress(ev, 0)} tabIndex={0}></CurrencyInput>
                </div>
                <div>
                    <span>Categoría: </span>
                    <select onKeyUp={(ev) => onEsnterPress(ev, 1)} tabIndex={1}>
                        <option value="otros">-</option>
                        <option value="compra">La compra</option>
                        <option value="energia">Energía</option>
                        <option value="transporte">Transporte</option>
                        <option value="bares">Bares y más</option>
                        <option value="suscripciones">Suscripciones</option>
                        <option value="caprichos">Caprichos</option>
                        <option value="regalos">Regalos</option>
                        <option value="casa">Cosas de casa</option>
                        <option value="ropa">Ropa</option>
                        <option value="mascotas">Gatetes</option>
                    </select>
                </div>
                <div>
                    <span>Fecha: </span>
                    <input id="monthInput" type="date" defaultValue={getCurrentDate()} onKeyUp={(ev) => onEsnterPress(ev, 2)} required tabIndex={2}></input>
                </div>
                <button id="SubmitExpense" onClick={submitExpense}>Añadir gasto</button>
            </div>
            <div className={styles.navigationGroup}>
                <CLSNavButton title="Gráficas" route="/economics/graphs"></CLSNavButton>
                <CLSNavButton title="Gastos" route="/economics/expenses"></CLSNavButton>
            </div>
        </div>
    );
}