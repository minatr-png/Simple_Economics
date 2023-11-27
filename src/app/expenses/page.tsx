"use client";
import { database_url } from '@clsGlobals';
import styles from  './styles.module.css';
import PocketBase from 'pocketbase';

const db = new PocketBase(database_url);

const prueba = () => {
    db.collection('Expenses').getFullList({ sort: '-created' }).then(res => {
        console.log(res);
    });
}

export default function Page() {
    return (
        <div id="moduleContainer" className={" bg-economics"}>
            <button onClick={prueba}>Expenses</button>
        </div>
    );
}