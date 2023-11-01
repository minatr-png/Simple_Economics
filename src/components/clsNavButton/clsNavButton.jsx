"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const CLSNavButton = ({title, route='', goBack=false, goForward=false}) => {

    const router = useRouter();
    const navArrows = (goBack, goForward) => {
        if (goBack) router.back();
        else if (goForward) router.forward();
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