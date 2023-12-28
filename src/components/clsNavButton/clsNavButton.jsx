"use client";
import './clsNavButton.css';
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CLSNavButton = ({title='', route='', logout=false}) => {

    if (logout) {
        let [hiddenModal, setHiddenModal] = useState(true);

        const router = useRouter();
        const logOut = () => {
            console.log("Te deslogaría COOKIES y todo");
            router.push("/login");
            setHiddenModal(true);
        };

        return (
            <button onClick={() => setHiddenModal(false)}>
                <span>
                    <IoIosLogOut size={14}/>
                </span>
                {!hiddenModal && (
                    <LogoutModal hideModalFunction={() => setHiddenModal(true)} acceptFunction={logOut} declienFunction={() => setHiddenModal(true)}/>
                )}
            </button>
        );
    }

    return (
        <Link href={route}>
            <button>
                <span>{title}</span>
            </button>
        </Link>
    );
}

function LogoutModal({hideModalFunction, acceptFunction, declienFunction}) {
    return (
        <div className="modalWrapper" onClick={ev => ev.stopPropagation()}>
            <div className="backdrop" onClick={hideModalFunction}></div>
            <div className="modal">
                <div className="modalContent">
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"/>
                    <div>Estás seguro de que quieres cerrar sesión Juan Abeto?</div>
                    <div className="buttons">
                        <div onClick={acceptFunction}>Sí</div>
                        <div onClick={declienFunction}>No</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CLSNavButton;