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
    useEffect(() => {
    var ctx = (document.getElementById('myChart') as any).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
          }]
        }
      });
    }, []);

    return (
        <div id="moduleContainer" className={styles.graphs + " bg-economics"}>
            <div className={styles.header}>
                <CLSYearSwitch></CLSYearSwitch>
            </div>
            <div className={styles.body}>
                <div className={styles.graph}>
                    <div>
                        <canvas id='myChart'></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}