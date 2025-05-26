import React from 'react'


interface InputProps {
    type: string
    placeholder?: string
    value: string,
    className?: string,
    title?: string,
    titleClassName?: string,
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}


const Input: React.FC<InputProps> = ({ type, placeholder, value, className, readOnly, title, titleClassName, onChange, onBlur, onFocus }) => {
    return (
        <div className='flex flex-col gap-2 w-full'>
            <span className={`${titleClassName} text-gray-700`}>{title}</span>
            <input
                type={type}
                placeholder={placeholder ? placeholder : "Enter text"}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                readOnly={readOnly}
                className={`${className} input input-bordered`}
            />
        </div>
    )
}

export default Input
