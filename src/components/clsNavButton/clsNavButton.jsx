import Link from "next/link";

const CLSNavButton = ({title, route}) => {
    return (
        <Link href={route}>
            <button>
                <span>{title}</span>
            </button>
        </Link>
    )
}

export default CLSNavButton;