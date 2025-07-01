import React from 'react'

const ProfileLetters = ({ text, className, containerClassName }: { text: string, className?: string, containerClassName?: string }) => {
    return (
        <div className={`${containerClassName} rounded-full flex items-center justify-center`}>
            <span className={`${className} font-bold flex items-center justify-center`}>{text.toUpperCase()}</span>
        </div>
    )
}

export default ProfileLetters
