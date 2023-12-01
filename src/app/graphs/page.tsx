"use client";
import { database_url } from '@clsGlobals';
import CLSYearSwitch from '@clsYearSwitch';
import styles from  './styles.module.css';
import PocketBase from 'pocketbase';
import Chart from 'chart.js/auto';
import { useEffect, useState } from 'react';

const db = new PocketBase(database_url);

const prueba = () => {
    db.collection('Expenses').getFullList({ sort: '-created' }).then(res => {
        console.log(res);
    });
}

export default function Page() {
    let current_year = new Date().getFullYear();
    let [years, setYears] = useState([]);
    useEffect(() => {
        db.collection('vExpensesYears').getFullList({ fields: 'year', sort: 'year'}).then(res => {
            setYears(res.map(el => el.year));
        });

        let expenses_chart, category_chart;
        db.collection('vExpenses').getFullList({fields: 'amount, category, month',filter: `date >= '${current_year}-01-01' && date <= '${current_year}-12-31'`}).then(res => {
            let expenses = [0,0,0,0,0,0,0,0,0,0,0,0], balance = [0,0,0,0,0,0,0,0,0,0,0,0], categories_data = {};
            res.forEach(expense => {
                balance[expense.month - 1] += expense.amount;
                if (expense.amount < 0) expenses[expense.month - 1] -= expense.amount;

                if (categories_data[expense.category]) 
                    categories_data[expense.category] += expense.amount;
                else 
                    categories_data[expense.category] = expense.amount;
            });

            expenses_chart.data.datasets[0].data = balance;
            expenses_chart.data.datasets[1].data = expenses;
            expenses_chart.update();

            let category_ctx = (document.getElementById('categoriesChart') as any).getContext('2d');
            category_chart = new Chart(category_ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(categories_data),
                    datasets: [{
                        data: Object.values(categories_data),
                        hoverOffset: 4
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
        });

        let expenses_ctx = (document.getElementById('expensesChart') as any).getContext('2d');
        expenses_chart = new Chart(expenses_ctx, {
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [{
                    type: 'bar',
                    label: 'Balance',
                    data: [0,0,0,0,0,0,0,0,0,0,0,0],
                    borderWidth: 1
                }, {
                    label: 'Gastos',
                    data: [0,0,0,0,0,0,0,0,0,0,0,0],
                    type: 'line',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'white'
                        }
                    }
                }, 
                scales: {
                    y: {
                        ticks: {
                            color: 'white'
                        }, 
                        grid: {
                            color: 'gray'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        
    }, []);    

    const [expenses, setCategories] = useState([]);
    useEffect(() => {
        db.collection('categories').getFullList({ fields: 'order, descrip, id', sort: 'order' }).then((res) => {
            let loaded_categories = res.map(category => ({ data: { id: category.id, descrip: category.descrip }, id: category.order}));
            setCategories(loaded_categories);
        });
    }, []);

    const onYearChange = (year) => {
        console.log(year);
    };

    return (
        <div id="moduleContainer" className={styles.graphs + " bg-economics"}>
            <div className={styles.header}>
                <CLSYearSwitch default_year={current_year} years={years} onChange={year => onYearChange(year)}></CLSYearSwitch>
            </div>
            <div className={styles.body}>
                <div className={styles.graph}>
                    <div>
                        <canvas id='expensesChart'></canvas>
                    </div>
                </div>
                <div className={styles.graph}>
                    <div>
                        <canvas id='categoriesChart'></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}