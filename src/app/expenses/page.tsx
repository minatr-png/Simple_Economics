"use client";
import { database_url } from '@clsGlobals';
import styles from  './styles.module.css';
import CLSYearSwitch from '@clsYearSwitch';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const db = new PocketBase(database_url);

const prueba = () => {
    db.collection('Expenses').getFullList({ sort: '-created' }).then(res => {
        console.log(res);
    });
}

const default_year = new Date().getFullYear();
export default function Page() {
    let [current_year, setCurrentYear] = useState(default_year);
    let [expenses, setExpenses] = useState({});
    let [years, setYears] = useState([]);
    //Effect to run on first load
    useEffect(() => {
        db.collection('vExpensesYears').getFullList({ fields: 'year', sort: 'year', requestKey: ''}).then(res => {
            setYears(res.map(el => el.year));
        });
    }, []);

    //Effect to run on Current_Year change
    useEffect(() => {
        loadExpenses();
    }, [current_year]);

    let update_value = 0;
    const loadExpenses = () => {
        db.collection('vExpenses').getFullList({
            fields: 'id, amount, month', sort: 'date, created',filter: `date >= '${current_year}-01-01' && date <= '${current_year}-12-31'`
        }).then(res => {
            const grouped_expenses = res.reduce((result, obj) => {
                const month = obj.month;
                if (!result[month]) {
                  result[month] = [];
                }
                result[month].push(<CurrencyInput onValueChange={(_, __, values) => update_value = values.float} onBlur={ev => _onBlur(ev.target)}
                    id={obj.id} key={obj.id} groupSeparator='.' decimalSeparator=',' suffix='€' decimalsLimit={2} defaultValue={obj.amount} name={obj.amount}
                    style={obj.amount < 0 ? {color: "rgb(214 80 80)"} : {color: "rgb(112 178 112)"}}></CurrencyInput>
                );
              
                return result;
            }, {});
            setExpenses(grouped_expenses);
        }).catch(err => {
            if (!err.isAbort) {
                throw err;
            }
        });;
    };

    const _onBlur = (input:HTMLInputElement) => {
        if (update_value) {
            if (update_value+"" === input.name) return;

            const data = {
                "amount": update_value
            };
            
            db.collection('Expenses').update(input.id, data).then(() => {
                input.style.color = update_value < 0 ? "rgb(214 80 80)" : "rgb(112 178 112)";
                input.name = update_value+"";

                toast.success('Gasto actualizado', {
                    position: 'bottom-right',
                    autoClose: 1700
                });
            });

            return;
        }

        db.collection('Expenses').delete(input.id).then(() => {
            input.remove();

            toast.success('Gasto eliminado', {
                position: 'bottom-right',
                autoClose: 1700
            });
        });
    }

    const onYearChange = (year) => {
        if (year !== current_year) {
            setCurrentYear(year);
        }
    };

    return (
        <div id="moduleContainer" className={" bg-economics"}>
            <ToastContainer/>
            <div className={styles.header}>
                <CLSYearSwitch default_year={default_year} years={years} onChange={year => onYearChange(year)}></CLSYearSwitch>
            </div>
            <div className={styles.body}>
                <div>
                    <div>Enero</div>
                    <div>{expenses[1]}</div>
                </div>
                <div>
                    <div>Febero</div>
                    <div>{expenses[2]}</div>
                </div>
                <div>
                    <div>Marzo</div>
                    <div>{expenses[3]}</div>
                </div>
                <div>
                    <div>Abril</div>
                    <div>{expenses[4]}</div>
                </div>
                <div>
                    <div>Mayo</div>
                    <div>{expenses[5]}</div>
                </div>
                <div>
                    <div>Junio</div>
                    <div>{expenses[6]}</div>
                </div>
                <div>
                    <div>Julio</div>
                    <div>{expenses[7]}</div>
                </div>
                <div>
                    <div>Agosto</div>
                    <div>{expenses[8]}</div>
                </div>
                <div>
                    <div>Septiembre</div>
                    <div>{expenses[9]}</div>
                </div>
                <div>
                    <div>Octubre</div>
                    <div>{expenses[10]}</div>
                </div>
                <div>
                    <div>Noviembre</div>
                    <div>{expenses[11]}</div>
                </div>
                <div>
                    <div>Diciembre</div>
                    <div>{expenses[12]}</div>
                </div>
                
            </div>
        </div>
    );
}