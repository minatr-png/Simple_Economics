"use client";
//import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import styles from  "./styles.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onEnterPress from '@clsInputs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    
    let [custom_server, setCustomServer] = useState(false);
    let [user, setUser] = useState({
        url:null,
        user: null,
        password: null
    });

    const router = useRouter();
    const login = () => {
        //Revisar login
        console.log(user);
        //cookies().set('user', JSON.stringify(user), {secure: true});
        debugger;
        //console.log(cookies().get('user'));
        router.push("/");
    };

    const handleUserChange = (ev) => {
        setUser({
            ...user,
            [ev.currentTarget.name]: ev.currentTarget.value
        });
    };

    return (
        <div id="moduleContainer" className={styles.container + " bg-economics"}>
            <div>
                <div className={styles.logo}>
                    <img src='/logo.png' ></img>
                </div>
                <div className={styles.inputs}>
                    {custom_server ? 
                        <div>
                            <div>URL</div>
                            <input tabIndex={1} name="url" onChange={handleUserChange} onKeyUp={(ev) => onEnterPress(ev, 1, false)}></input>
                        </div>
                        :
                        <></>
                    }
                    <div>
                        <div>Email</div>
                        <input tabIndex={2} name="user" type="email" onChange={handleUserChange} onKeyUp={(ev) => onEnterPress(ev, 2, false)}></input>
                    </div>
                    <div>
                        <div>Contraseña</div>
                        <input tabIndex={3} name="password" type="password" onChange={handleUserChange} onKeyUp={(ev) => onEnterPress(ev, 3, true)}></input>
                    </div>
                    <div className={styles.checkbox}>
                        <input onChange={() => setCustomServer(!custom_server)} type="checkbox"/> 
                        <span onClick={(ev) => { ev.currentTarget.parentElement.querySelector('input').click(); }}>Servidor propio</span>
                    </div>
                    <button id="MainButton" onClick={login}>Iniciar sesión</button>
                </div>
            </div>
        </div>
    );
}