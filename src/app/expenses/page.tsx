"use client";
import { database_url } from '@clsGlobals';
import styles from  './styles.module.css';
import CLSYearSwitch from '@clsYearSwitch';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';

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

    const loadExpenses = () => {
        db.collection('vExpenses').getFullList({
            fields: 'amount, month', sort: 'date',filter: `date >= '${current_year}-01-01' && date <= '${current_year}-12-31'`
        }).then(res => {
            const grouped_expenses = res.reduce((result, obj) => {
                const month = obj.month;
                if (!result[month]) {
                  result[month] = [];
                }
                result[month].push(<div>{obj.amount}€</div>);
              
                return result;
            }, {});
            console.log(grouped_expenses);
            setExpenses(grouped_expenses);
        });
    };

    const onYearChange = (year) => {
        if (year !== current_year) {
            setCurrentYear(year);
        }
    };

    return (
        <div id="moduleContainer" className={" bg-economics"}>
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