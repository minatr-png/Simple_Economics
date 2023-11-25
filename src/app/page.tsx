"use client";
import PocketBase from 'pocketbase';
import styles from  './styles.module.css';
import CurrencyInput  from 'react-currency-input-field';
import CLSNavButton from '@clsNavButton';
import CLSCombo from '@clsCombo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddRecordLayout, NavButtonsLayout } from '@clsLayouts';
import onEnterPress from '@clsInputs';
import { useEffect, useState } from 'react';

export default function Page() {
    
    const db = new PocketBase('http://127.0.0.1:8090');

    let [data, setData] = useState([]);
    useEffect(() => {
        db.collection('categories').getFullList({ fields: 'id, descrip', sort: 'order' }).then((res) => {
            setData(res);
        });
    }, []);

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
    
    const submitExpense = () => {
        let category, date;
        category = document.getElementById('categoryInput').getAttribute('realvalue');
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
                        onKeyUp={(ev) => onEnterPress(ev, 1)} tabIndex={1}></CurrencyInput>
                </div>
                <div>
                    <span>Categoría: </span>
                    <CLSCombo id="categoryInput" data={data} descrip_field="descrip" value_field="id" tabIndex="2" onKeyUp={ev => onEnterPress(ev, 2)}></CLSCombo>
                </div>
                <div>
                    <span>Fecha: </span>
                    <input id="dateInput" type="date" defaultValue={getCurrentDate()} onKeyUp={(ev) => onEnterPress(ev, 3, true)} required tabIndex={3}></input>
                </div>
            </AddRecordLayout>
            <NavButtonsLayout>
                <CLSNavButton title="Gráficas" route="/graphs"></CLSNavButton>
                <CLSNavButton title="Gastos" route="/expenses"></CLSNavButton>
                <CLSNavButton title="Añadir categoría" route="/categories"></CLSNavButton>
                <ToastContainer />
            </NavButtonsLayout>
        </div>
    );
}