import React from 'react'


interface PlusIconProps {
    title: string;
    onClick?: () => void;
}

// From: https://uiverse.io/catraco/fluffy-quail-74
const PlusIcon: React.FC<PlusIconProps> = ({ title, onClick }) => {
    return (
        <button
            className="group cursor-pointer outline-none hover:rotate-90 duration-300 flex items-center"
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22px"
                height="22px"
                viewBox="0 0 24 24"
                className="stroke-zinc-800 fill-none group-active:fill-zinc-200 transition duration-300"
            >
                <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    strokeWidth="1.5"
                ></path>
                <path d="M8 12H16" strokeWidth="1.5"></path>
                <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
        </button>
    )
}

export default PlusIcon
