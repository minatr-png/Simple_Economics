"use client";
import PocketBase from 'pocketbase';
import styles from  './styles.module.css';
import CurrencyInput  from 'react-currency-input-field';
import CLSNavButton from '@clsNavButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddRecordLayout, NavButtonsLayout } from '@clsEconomicsUtils';

export default function Page() {
    
    const db = new PocketBase('http://127.0.0.1:8090');

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
        if (ev.key !== "Enter") return;
        
        if(tabIndex === 3) {
            document.getElementById("MainButton").click();
        } else {
            (document.querySelector(`[tabindex="${tabIndex+1}"]`) as any).focus();
        }
    }
    
    const submitExpense = () => {
        let category, date;
        category = (document.getElementById('categoryInput') as HTMLSelectElement).value;
        date = (document.getElementById('dateInput') as HTMLInputElement).value;
 
        if (category && date && amount) {
            const data = {
                "amount": amount,
                "category": category,
                "date": "2022-01-01 10:00:00.123Z"
            };

            db.collection('Expenses').create(data).then( rec => {
                toast.success('Gasto añadido', {
                    position: 'bottom-right',
                    autoClose: 1700
                });
            });
        } else {
            
            toast.error('Faltan campos por rellenar', {
                position: 'bottom-right',
                autoClose: 1700
            });
        }
    }

    return (
        <div id="moduleContainer" className={styles.economics + " bg-economics"}>
            <AddRecordLayout params={{btnTitle: "Añadir gasto", btnFunction: submitExpense}}>
                <div>
                    <span>Gasto: </span>
                    <CurrencyInput id="amountInput" placeholder="0.00€" onValueChange={inpChange} groupSeparator='.' decimalSeparator=',' suffix='€' 
                        onKeyUp={(ev) => onEsnterPress(ev, 1)} tabIndex={1}></CurrencyInput>
                </div>
                <div>
                    <span>Categoría: </span>
                    <select id="categoryInput" onKeyUp={(ev) => onEsnterPress(ev, 2)} tabIndex={2}>
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
                    <input id="dateInput" type="date" defaultValue={getCurrentDate()} onKeyUp={(ev) => onEsnterPress(ev, 3)} required tabIndex={3}></input>
                </div>
            </AddRecordLayout>
            <NavButtonsLayout>
                <CLSNavButton title="Gráficas" route="/economics/graphs"></CLSNavButton>
                <CLSNavButton title="Gastos" route="/economics/expenses"></CLSNavButton>
                <CLSNavButton title="Añadir categoría" route="/economics/categories"></CLSNavButton>
                <ToastContainer />
            </NavButtonsLayout>
        </div>
    );
}