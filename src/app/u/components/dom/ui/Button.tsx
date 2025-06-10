import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    className?: string;
    children?: React.ReactNode;
}

const Button: React.FC<Props> = ({
    text,
    className = '',
    children,
    ...buttonProps
}) => {
    return (
        <button
            {...buttonProps}
            className={`btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 rounded-lg shadow-lg disabled:bg-muted disabled:pointer-events-none ${className}`}
        >
            {text}
            {children}
        </button>
    );
};

export default Button;
