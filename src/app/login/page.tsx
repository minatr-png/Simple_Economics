"use client";
import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import styles from  "./styles.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onEnterPress from '@clsInputs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    
    const router = useRouter();
    const login = () => {
        //Revisar login
        router.push("/");
    };

    return (
        <div id="moduleContainer" className={styles.container + " bg-economics"}>
            <div>
                <div className={styles.logo}>
                    <img src='/logo.png' ></img>
                </div>
                <div className={styles.inputs}>
                    <div>
                        <div>URL</div>
                        <input tabIndex={1} onKeyUp={(ev) => onEnterPress(ev, 1, false)}></input>
                    </div>
                    <div>
                        <div>Email</div>
                        <input tabIndex={2} type="email" onKeyUp={(ev) => onEnterPress(ev, 2, false)}></input>
                    </div>
                    <div>
                        <div>Contraseña</div>
                        <input tabIndex={3} id="dateInput" type="password" onKeyUp={(ev) => onEnterPress(ev, 3, true)} required></input>
                    </div>
                    <button id="MainButton" onClick={login}>Iniciar sesión</button>
                </div>
            </div>
        </div>
    );
}