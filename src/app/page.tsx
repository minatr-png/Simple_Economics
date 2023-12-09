"use client";
import { database_url } from '@clsGlobals';
import PocketBase from 'pocketbase';
import styles from  './styles.module.css';
import CurrencyInput, { formatValue } from 'react-currency-input-field';
import CLSNavButton from '@clsNavButton';
import CLSCombo from '@clsCombo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddRecordLayout, NavButtonsLayout } from '@clsLayouts';
import onEnterPress from '@clsInputs';
import { useEffect, useState } from 'react';

export default function Page() {
    
    const db = new PocketBase(database_url);

    let [total_money_value, setTotalMoneyValue] = useState(0);
    let [total_money, setTotalMoney] = useState('0');
    let [categoryData, setCategoryData] = useState([]);
    useEffect(() => {
        db.collection('categories').getFullList({ fields: 'id, descrip', sort: 'order' }).then((res) => {
            setCategoryData([{descrip: '-', id: null}, ...res]);
        });

        db.collection('vTotalMoney').getOne('0', {fields: 'totalMoney'}).then(res => setTotal(res.totalMoney));
    }, []);

    let amount;
    const inpChange = (val) => {            
        amount = val;
    }

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    
    const submitExpense = () => {
        let category, date;
        category = document.getElementById('categoryInput').getAttribute('realvalue');
        date = (document.getElementById('dateInput') as HTMLInputElement).value + '-01';
 
        const error_message = checkSubmissionValues(date, amount, category);
        if (error_message) {
            toast.error(error_message, {
                position: 'bottom-right',
                autoClose: 1700
            });
            return;
        }

        const data = {
            "amount": amount.replace(',', '.'),
            "category": category,
            "date": date
        };

        db.collection('Expenses').create(data).then( rec => {
            setTotal(total_money_value + rec.amount);
            toast.success('Gasto añadido', {
                position: 'bottom-right',
                autoClose: 1700
            });
        });
    }

    const checkSubmissionValues = (date, amount, category) => {
        if (!date || !amount) return 'Faltan campos por rellenar';

        if (category) return amount > 0 ? 'No se admite categoría al agregar ingresos' : null; 

        return  amount < 0 ? 'Faltan campos por rellenar' : null;
    }

    const setTotal = (new_total) => {
        setTotalMoneyValue(new_total);
        const value = formatValue({value: new_total+'', groupSeparator: '.', decimalSeparator: ','});
        setTotalMoney(value);
    }

    return (
        <div id="moduleContainer" className={styles.economics + " bg-economics"}>
            <AddRecordLayout params={{btnTitle: "Añadir gasto", btnFunction: submitExpense}}>
                <div>
                    <span>Gasto</span>
                    <CurrencyInput id="amountInput" placeholder="0.00€" onValueChange={inpChange} groupSeparator='.' decimalSeparator=',' suffix='€' 
                        onKeyUp={(ev) => onEnterPress(ev, 1)} tabIndex={1}></CurrencyInput>
                </div>
                <div style={{zIndex: 1}}>
                    <span>Categoría</span>
                    <CLSCombo id="categoryInput" data={categoryData} descrip_field="descrip" value_field="id" tabIndex="2" onKeyUp={ev => onEnterPress(ev, 2)}></CLSCombo>
                </div>
                <div>
                    <span>Fecha</span>
                    <input id="dateInput" type="month" defaultValue={getCurrentDate()} onKeyUp={(ev) => onEnterPress(ev, 3, true)} required tabIndex={3}></input>
                </div>
            </AddRecordLayout>
            <NavButtonsLayout>
                <CLSNavButton title="Gráficas" route="/graphs"></CLSNavButton>
                <CLSNavButton title="Gastos" route="/expenses"></CLSNavButton>
                <CLSNavButton title="Añadir categoría" route="/categories"></CLSNavButton>
                <ToastContainer />
                <div className={styles.totalMoney} id="totalMoney"><span>Total: </span> {total_money}€</div>
            </NavButtonsLayout>
        </div>
    );
}