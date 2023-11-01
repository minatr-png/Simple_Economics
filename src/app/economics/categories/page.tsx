"use client";
import styles from  '../styles.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddRecordLayout, NavButtonsLayout } from '@clsEconomicsUtils';

export default function Page() {
    return (
        <div id="moduleContainer" className={styles.economics + " bg-economics"}>
            <AddRecordLayout params={{btnTitle: "Añadir Categoría", btnFunction: () => {console.log('Hola')}}} >
                <div>
                    <span>Categoría: </span>
                    <input id="descripInput" type="text" placeholder="Otros" required tabIndex={0}></input>
                </div>
            </AddRecordLayout>
            <NavButtonsLayout>
                <button>Aquí va una tabla</button>
                <ToastContainer />
            </NavButtonsLayout>
        </div>
    );
}