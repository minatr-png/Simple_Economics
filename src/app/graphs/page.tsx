"use client";
import { database_url } from '@clsGlobals';
import CLSYearSwitch from '@clsYearSwitch';
import styles from  './styles.module.css';
import PocketBase from 'pocketbase';
import Chart, { ArcElement } from 'chart.js/auto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

const db = new PocketBase(database_url);

const default_year = new Date().getFullYear();
let expenses_chart, categories_chart, expenses_ctx, categories_ctx;    
export default function Page() {
    let [current_year, setCurrentYear] = useState(default_year);
    let [years, setYears] = useState([]);
    let [expenses_rows, setExpensesRows] = useState([
        <tr key={0}><td></td> <td>Gastos</td> <td>Total</td></tr>,
        <tr key={1}><td>Enero</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={2}><td>Febero</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={3}><td>Marzo</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={4}><td>Abril</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={5}><td>Mayo</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={6}><td>Junio</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={7}><td>Julio</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={8}><td>Agosto</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={9}><td>Septiembre</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={10}><td>Octubre</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={11}><td>Noviembre</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>,
        <tr key={12}><td>Diciembre</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td> <td style={{background: 'rgb(112, 178, 112)'}}>0€</td></tr>
    ]);

    //Effect to run on first load
    useEffect(() => {
        db.collection('vExpensesYears').getFullList({ fields: 'year', sort: 'year', requestKey: ''}).then(res => {
            setYears(res.map(el => el.year));
        });
    }, []);

    //Effect to run on Current_Year change
    useEffect(() => {
        loadCharts();
        loadAnnotations();
    }, [current_year]);

    const loadCharts = () => {
        // Generating Expenses chart without values
        let expenses_html =document.getElementById('expensesChart') as HTMLCanvasElement
        if(!expenses_html.getAttribute('loaded')) {
            expenses_ctx = expenses_html.getContext('2d');
            expenses_chart = new Chart(expenses_ctx, {
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        type: 'bar',
                        label: 'Balance',
                        data: [0,0,0,0,0,0,0,0,0,0,0,0],
                        borderWidth: 1,
                        order: 2
                    }, {
                        label: 'Gastos',
                        data: [0,0,0,0,0,0,0,0,0,0,0,0],
                        type: 'line',
                        borderWidth: 1,
                        order: 1
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
            expenses_html.setAttribute('loaded', 'true');
        }

        //Retrieving databse values
        db.collection('vExpenses').getFullList({fields: 'amount, category, month', sort: 'date',filter: `date >= '${current_year}-01-01' && date <= '${current_year}-12-31'`}).then(res => {
            //Iterating through databse results
            let expenses = [0,0,0,0,0,0,0,0,0,0,0,0], balance = [0,0,0,0,0,0,0,0,0,0,0,0], categories_data = {};
            res.forEach(expense => {
                balance[expense.month - 1] += expense.amount;
                if (expense.category) {
                    expenses[expense.month - 1] -= expense.amount;

                    if (categories_data[expense.category]) 
                        categories_data[expense.category] += expense.amount;
                    else {
                        categories_data[expense.category] = expense.amount;
                    }
                }
            });

            //Update expenses chart
            expenses_chart.data.datasets[0].data = balance;
            expenses_chart.data.datasets[1].data = expenses;
            expenses_chart.update();

            createExpensesTable(res, Object.keys(categories_data));

            //Create categories chart
            let categories_html = document.getElementById('categoriesChart') as HTMLCanvasElement;
            if (categories_html.getAttribute('loaded')) {
                categories_chart.data.labels = Object.keys(categories_data);
                categories_chart.data.datasets[0].data = Object.values(categories_data);
                categories_chart.update();
            } else {
                categories_ctx = categories_html.getContext('2d');
                categories_chart = new Chart(categories_ctx, {
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
                                labels: { color: 'white' }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const total = (context.chart.getDatasetMeta(0) as any).total;
                                        const percent = (((context.raw as number) / total) * 100).toFixed(2)+'%'; 
                                        return [context.raw+'€', percent];
                                    }
                                }
                            }
                        },
                        animation: {
                            onComplete: function() { return _onComplete(this); }
                        }
                    }
                });
                categories_html.setAttribute('loaded', 'true');
            }
        }).catch(err => {
            if (!err.isAbort) {
                throw err;
            }
        });
    }

    const _onComplete = (chart) => {
        if (chart.tooltip._active && chart.tooltip._active.length !== 0) return;
            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0) as any;
            const total = meta.total;
            for (let i = 0; i < dataset.data.length; i++) {
                const model = meta.data[i] as ArcElement;
                const mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2;
                const mid_angle = model.startAngle + (model.endAngle - model.startAngle) / 2;

                const x = mid_radius * Math.cos(mid_angle);
                const y = mid_radius * Math.sin(mid_angle);

                chart.ctx.fillStyle = 'black';
            
                const percent = Math.round(((dataset.data[i] as number) / total) * 100)+'%';
                const euros_size = chart.ctx.measureText(dataset.data[i]+'€');
                const percent_size = chart.ctx.measureText(dataset.data[i]+'€');

                chart.ctx.fillText(dataset.data[i]+'€', model.x + x - (euros_size.width/2), model.y + y);
                chart.ctx.fillText(percent, model.x + x - (percent_size.width/2), model.y + y + 15);
            }
    }

    const createExpensesTable = (expenses, categories:Array<string>) => {
        // Grouping expenses by month and category
        let min_expense = 0;
        const groupExpenses = (expenses) => {
            return expenses.reduce((acc, expense) => {
                const { month, category, amount } = expense;
                const key = `${month}-${category}`;
        
                if (!acc[key]) {
                    acc[key] = 0;
                }
        
                if (amount < min_expense) {
                    min_expense = amount;
                }

                acc[key] += amount;
        
                return acc;
            }, {});
        };
        
        const grouped_expenses = groupExpenses(expenses);

        
        //Creating table
        let header_cells = [<td></td>], new_expenses_rows_cells = []; 
        let totals = [], min_total_expense = 0, max_total_expense = null;
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        for (let i = 1; i <= 12; i++) {    
            let cells = [];
            cells.push(<td>{months[i-1]}</td>);

            //Creating category cells
            let row_total = 0;
            categories.forEach(category => {
                if(i === 1) {
                    header_cells.push(<td>{category}</td>);
                }
                
                const current_expense = grouped_expenses[i+'-'+category] || 0;
                const background_color = calculateCellColor(current_expense, min_expense, 0);
                row_total += current_expense;

                cells.push(<td style={{background: background_color}}>{current_expense+'€'}</td>);
            });

            totals.push(row_total);
            if(row_total < min_total_expense) min_total_expense = row_total;
            if(row_total > max_total_expense || max_total_expense === null) max_total_expense = row_total;

            new_expenses_rows_cells.push(cells);
        }

        header_cells.push(<td>Total</td>);

        let new_expenses_rows = [];
        new_expenses_rows_cells.forEach((row, i) => {
            row.push(<td style={{backgroundColor: calculateCellColor(totals[i], min_total_expense, max_total_expense)}}>{totals[i]+'€'}</td>);
            new_expenses_rows.push(<tr key={i}>{row}</tr>);
        });

        setExpensesRows(([<tr key={0}>{header_cells}</tr>, ...new_expenses_rows]));
    };

    const calculateCellColor = (value:number, minValue:number, maxValue:number) => {
        const red = [204, 102, 102];
        const yellow = [204, 204, 102];
        const green = [112, 178, 112];

        const ratio = (value - minValue) / (maxValue - minValue);
        const middleRange = 0.5;

        //Calculate color for the lower half of the values (red to yellow)
        if (ratio < middleRange) {
            const lowerRatio = ratio / middleRange;
            const interpolatedColor = [
                Math.round((1 - lowerRatio) * red[0] + lowerRatio * yellow[0]),
                Math.round((1 - lowerRatio) * red[1] + lowerRatio * yellow[1]),
                Math.round((1 - lowerRatio) * red[2] + lowerRatio * yellow[2]),
            ];
            return `rgb(${interpolatedColor.join(',')})`;
        }
        
        //Calculate color for the upper half of the values (yellow to green)
        const upperRatio = (ratio - middleRange) / (1 - middleRange);
        const interpolatedColor = [
            Math.round((1 - upperRatio) * yellow[0] + upperRatio * green[0]),
            Math.round((1 - upperRatio) * yellow[1] + upperRatio * green[1]),
            Math.round((1 - upperRatio) * yellow[2] + upperRatio * green[2]),
        ];

        return `rgb(${interpolatedColor.join(',')})`;

    }

    const loadAnnotations = () => {
        db.collection('Annotations').getFullList({ fields:'id, month, annotation', sort: '-month', filter: `year=${current_year}`}).then(res => {
            document.querySelectorAll('textarea').forEach(text_area => text_area.value = '');

            res.forEach(annotation => {
                const text_area = document.querySelector(`textarea[my-month="${annotation.month}"]`) as HTMLTextAreaElement;
                text_area.value = annotation.annotation;
                text_area.setAttribute('registerId', annotation.id);
            });
        }).catch(err => {
            if (!err.isAbort) {
                throw err;
            }
        });
    };

    const onAnnotationChange = (ev) => {
        let text_area = ev.target as HTMLTextAreaElement;

        const data = {
            year: current_year,
            month: parseInt(text_area.getAttribute('my-month')),
            annotation: text_area.value
        };

        const register_id = text_area.getAttribute('registerId');
        if (register_id) {
            db.collection('Annotations').update(register_id, data).then( rec => {
                toast.success('Anotación actualizada', {
                    position: 'bottom-right',
                    autoClose: 1700
                });
            });
        } else {
            db.collection('Annotations').create(data).then( rec => {
                toast.success('Anotación actualizada', {
                    position: 'bottom-right',
                    autoClose: 1700
                });

                text_area.setAttribute('registerId', rec.id);
            });
        }
    };

    const onYearChange = (year) => {
        if (year !== current_year) {
            setCurrentYear(year);
        }
    };
    
    return (
        <div id="moduleContainer" className={styles.graphsPage + " bg-economics"}>
            <ToastContainer />
            <div className={styles.header}>
                <CLSYearSwitch default_year={default_year} years={years} onChange={year => onYearChange(year)}></CLSYearSwitch>
            </div>
            <div className={styles.body}>
                <div className={styles.graphs}>
                    <div>
                        <canvas id='categoriesChart'></canvas>
                    </div>
                    <div>
                        <canvas id='expensesChart'></canvas>
                    </div>
                </div>
                <div className={styles.tables}>
                    <table className={styles.expensesTable} id="expensesTable">
                       <tbody>
                            { expenses_rows }
                       </tbody>
                    </table>
                    <table id="annotationsTable">
                       <thead>
                            <tr>
                                <td></td>
                                <td>Anotaciones</td>
                            </tr>
                       </thead>
                       <tbody>
                            <tr className={styles.annotation}> 
                                <td>Enero</td> 
                                <td> <textarea rows={1} my-month="1" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Febrero</td> 
                                <td> <textarea rows={1} my-month="2" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Marzo</td> 
                                <td> <textarea rows={1} my-month="3" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Abril</td> 
                                <td> <textarea rows={1} my-month="4" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Mayo</td> 
                                <td> <textarea rows={1} my-month="5" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Junio</td> 
                                <td> <textarea rows={1} my-month="6" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Julio</td> 
                                <td> <textarea rows={1} my-month="7" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Agosto</td> 
                                <td> <textarea rows={1} my-month="8" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Septiembre</td> 
                                <td> <textarea rows={1} my-month="9" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Octubre</td> 
                                <td> <textarea rows={1} my-month="10" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Noviembre</td> 
                                <td> <textarea rows={1} my-month="11" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                            <tr className={styles.annotation}> 
                                <td>Diciembre</td> 
                                <td> <textarea rows={1} my-month="12" onBlur={ev => onAnnotationChange(ev)}></textarea> </td> 
                            </tr>
                       </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}