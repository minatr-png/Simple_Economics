"use client";
import { database_url } from '@clsGlobals';
import styles from  './styles.module.css';
import CLSYearSwitch from '@clsYearSwitch';
import PocketBase from 'pocketbase';
import { useEffect, useState, useRef } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const db = new PocketBase(database_url);
const default_year = new Date().getFullYear();
var categories_elements;
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
    const is_first_render = useRef(true);
    useEffect(() => {
        try {
            //On first load Categories and Expenses will be loaded at the same time to avoid rendering errors
            if(is_first_render.current) {
                is_first_render.current = false;

                Promise.all([
                    db.collection('categories').getFullList({ fields: 'id, descrip', sort: 'order' }),
                    db.collection('vExpenses').getFullList({
                        fields: 'id, amount, month, category', sort: 'date, created',filter: `date >= '${current_year}-01-01' && date <= '${current_year}-12-31'`
                    })
                ]).then (([categories, dbExpenses]) => {
                    categories_elements = categories.map(category => {
                        return <div id={category.id} key={category.id} onClick={ev => setNewCategory(category.id, ev.target)}>{category.descrip}</div>
                    });
        
                    loadExpenses(dbExpenses);
                })
                
                return;
            }

            //On every other load just Expenses will be reloaded
            db.collection('vExpenses').getFullList({
                fields: 'id, amount, month, category', sort: 'date, created',filter: `date >= '${current_year}-01-01' && date <= '${current_year}-12-31'`
            })
            .then(res => loadExpenses(res));
        } catch (err) {
            if (!err.isAbort) {
                throw err;
            }
        }
    }, [current_year]);

    let update_value = 0;
    const loadExpenses = (dbExpenses) => {
        const grouped_expenses = dbExpenses.reduce((result, obj) => {
            const month = obj.month;
            if (!result[month]) {
                result[month] = [];
            }

            result[month].push(
                <span expense-id={obj.id}>
                    <CurrencyInput onValueChange={(_, __, values) => update_value = values.float} onBlur={ev => _onBlur(ev.target)}
                    id={obj.id} key={obj.id} groupSeparator='.' decimalSeparator=',' suffix='€' decimalsLimit={2} defaultValue={obj.amount} name={obj.amount}
                    style={obj.amount < 0 ? {color: "rgb(214 80 80)"} : {color: "rgb(112 178 112)"}} onContextMenu={(ev) => {ev.preventDefault();console.log(obj.amount)}}></CurrencyInput>
                    <ContextMenu categories={categories_elements} currentCategory={obj.category}/>
                </span>
            );
            
            return result;
        }, {});
        setExpenses(grouped_expenses);
    };

    const setNewCategory = (category, element) => {
        const expense = element.closest('span[expense-id]').getAttribute('expense-id');

        const data = {"category": category};

        db.collection('Expenses').update(expense, data).then(() => {
            element.closest('div[class]').querySelector('div.currentCategory').textContent = element.textContent;

            toast.success('Gasto actualizado', {
                position: 'bottom-right',
                autoClose: 1700
            });
        });
    };

    const _onBlur = (input:HTMLInputElement, month?) => {
        if (update_value || month) {
            if (update_value+"" === input.name || !update_value) return;

            if (month) {
                insertExpense(input, month);
                return;
            }
            
            updateExpense(input);
            return;
        }

        deleteExpense(input);
    }

    const insertExpense = (input, month) => {
        let str_month = month < 10 ? '0' + month : month+'';
        const data = {
            "amount": update_value,
            "date": `${current_year}-${str_month}-01`
        };

        console.log(data);
        
        db.collection('Expenses').create(data).then(() => {
            input.style.color = update_value < 0 ? "rgb(214 80 80)" : "rgb(112 178 112)";
            input.name = update_value+"";

            toast.success('Gasto actualizado', {
                position: 'bottom-right',
                autoClose: 1700
            });
        });
    }

    const updateExpense = (input) => {
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
    }

    const deleteExpense = (input) => {
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

    const addExpense = (month) => {
    setExpenses(prevExpenses => {
        const newExpenses = { ...prevExpenses };

        if (!newExpenses[month]) {
            newExpenses[month] = [];
        }

        newExpenses[month] = [
            ...newExpenses[month],
            <CurrencyInput
                onValueChange={(_, __, values) => update_value = values.float}
                onBlur={ev => _onBlur(ev.target, month)}
                groupSeparator='.' decimalSeparator=','
                suffix='€' decimalsLimit={2}
                defaultValue={0}
                name={0 + ''}
            ></CurrencyInput>
        ];

        return newExpenses;
    });
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
                    <div>
                        {expenses[1]}
                        <div className={styles.addExpense} onClick={() => addExpense(1)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Febero</div>
                    <div>
                        {expenses[2]}
                        <div className={styles.addExpense} onClick={() => addExpense(2)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Marzo</div>
                    <div>
                        {expenses[3]}
                        <div className={styles.addExpense} onClick={() => addExpense(3)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Abril</div>
                    <div>
                        {expenses[4]}
                        <div className={styles.addExpense} onClick={() => addExpense(4)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Mayo</div>
                    <div>
                        {expenses[5]}
                        <div className={styles.addExpense} onClick={() => addExpense(5)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Junio</div>
                    <div>
                        {expenses[6]}
                        <div className={styles.addExpense} onClick={() => addExpense(6)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Julio</div>
                    <div>
                        {expenses[7]}
                        <div className={styles.addExpense} onClick={() => addExpense(7)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Agosto</div>
                    <div>
                        {expenses[8]}
                        <div className={styles.addExpense} onClick={() => addExpense(8)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Septiembre</div>
                    <div>
                        {expenses[9]}
                        <div className={styles.addExpense} onClick={() => addExpense(9)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Octubre</div>
                    <div>
                        {expenses[10]}
                        <div className={styles.addExpense} onClick={() => addExpense(10)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Noviembre</div>
                    <div>
                        {expenses[11]}
                        <div className={styles.addExpense} onClick={() => addExpense(11)}>+</div>
                    </div>
                </div>
                <div>
                    <div>Diciembre</div>
                    <div>
                        {expenses[12]}
                        <div className={styles.addExpense} onClick={() => addExpense(12)}>+</div>
                    </div>
                </div>
                
            </div>
        </div>
    );

    function ContextMenu({categories, currentCategory}) {
      return (
        <div className={styles.contextMenu}>
            <div className="currentCategory">{currentCategory}</div>
            <span>
                {categories}
            </span>
        </div>
        );
    }
  }