import Link from 'next/link';
import React from 'react'

const Attributions = () => {
    return (
        <div className='text-white'>
            <h1 className='text-lg'>Animations</h1>
            <section className='flex flex-col gap-4 p-4'>
                <UIVerseCopyWrite
                    title='Add Listing Icon Animation'
                    link='https://uiverse.io/catraco/fluffy-quail-74'
                    username='Catraco'
                />
                <UIVerseCopyWrite
                    title='Typewriter Animation'
                    link='https://uiverse.io/Nawsome/kind-mole-87'
                    username='Nawsome'
                />
                <UIVerseCopyWrite
                    title='Hover Box Animation'
                    link='https://uiverse.io/Juanes200122/great-starfish-26'
                    username='Juanes200122'
                />
                <UIVerseCopyWrite
                    title='Stack Loader Animation'
                    link='https://uiverse.io/csozidev/weak-bulldog-22'
                    username='csozidev'
                />
                <UIVerseCopyWrite
                    title='Hamster Wheel Animation'
                    link='https://uiverse.io/Nawsome/wet-mayfly-23'
                    username='Nawsome'
                />
            </section>
        </div>
    )
}


interface UIVerseCopyWriteProps {
    title: string;
    link: string;
    username: string;
}

const UIVerseCopyWrite: React.FC<UIVerseCopyWriteProps> = ({ title, link, username }) => {
    const uiverseCopyWriteNotice = "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:"
    const conditions = "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software."
    return (
        <div className='text-sm'>
            <Link className="hover:underline text-blue-500 text-base mb-2" href={link}>{title}</Link>

            <div className='mt-2'>Copywrite Notice</div>
            <div className='mb-2 mt-2'>
                Copyright - 2025 {username.toLowerCase()} ({username})
            </div>
            <div>
                {uiverseCopyWriteNotice}
            </div>
            <div className='mt-1'>
                {conditions}
            </div>
        </div>
    )
}



export default Attributions
