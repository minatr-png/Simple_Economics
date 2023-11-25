"use client";
import './clsNavButton.css';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const CLSNavButton = ({title, route='', goBack=false, goForward=false}) => {

    const router = useRouter();
    const navArrows = (goBack, goForward) => {
        if (goBack) router.push(getBackUrl());
        else if (goForward) router.forward();
    }

    const getBackUrl = () => {
        let current_url = window.location.href;
        let new_path = current_url.replace(/https?:\/\/[^\/]+/, '');

        return '/' + new_path.substring(0, new_path.lastIndexOf('/'));
    }

    if (goBack || goForward) {
        return (
            <span onClick={() => navArrows(goBack, goForward)}>
                <button>
                    <span>{title}</span>
                </button>
            </span>
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

export default CLSNavButton;