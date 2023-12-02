"use client";
import { database_url } from '@clsGlobals';
import CLSYearSwitch from '@clsYearSwitch';
import styles from  './styles.module.css';
import PocketBase from 'pocketbase';
import Chart, { ArcElement } from 'chart.js/auto';
import { useEffect, useState } from 'react';

const db = new PocketBase(database_url);

let current_year = new Date().getFullYear(), expenses_chart, categories_chart, expenses_ctx, categories_ctx;    
export default function Page() {
    let [years, setYears] = useState([]);
    useEffect(() => {
        db.collection('vExpensesYears').getFullList({ fields: 'year', sort: 'year'}).then(res => {
            setYears(res.map(el => el.year));
        });

        loadCharts();
    }, []);

    const loadCharts = () => {
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
            expenses_html.setAttribute('loaded', 'true');
        }

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
                                labels: {
                                    color: 'white'
                                }
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
                            onComplete: function () {
                                if ((this.tooltip as any)._active && (this.tooltip as any)._active.length !== 0) return;
                                const dataset = this.data.datasets[0];
                                const meta = this.getDatasetMeta(0) as any;
                                const total = meta.total;
                                for (let i = 0; i < dataset.data.length; i++) {
                                    const model = meta.data[i] as ArcElement;
                                    const mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2;
                                    const mid_angle = model.startAngle + (model.endAngle - model.startAngle) / 2;
                
                                    const x = mid_radius * Math.cos(mid_angle);
                                    const y = mid_radius * Math.sin(mid_angle);
                
                                    this.ctx.fillStyle = 'black';
                                
                                    const percent = Math.round(((dataset.data[i] as number) / total) * 100)+'%';
                                    const euros_size = this.ctx.measureText(dataset.data[i]+'€');
                                    const percent_size = this.ctx.measureText(dataset.data[i]+'€');

                                    this.ctx.fillText(dataset.data[i]+'€', model.x + x - (euros_size.width/2), model.y + y);
                                    this.ctx.fillText(percent, model.x + x - (percent_size.width/2), model.y + y + 15);
                                }
                            }
                        }
                    }
                });
                categories_html.setAttribute('loaded', 'true');
            }
        });
    }

    const onYearChange = (year) => {
        current_year = year;
        loadCharts();
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