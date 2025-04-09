import Link from 'next/link';
import React from 'react'

const Attributions = () => {
    return (
        <div className='text-gray-800 flex flex-col gap-24'>
            <section className='space-y-4'>
                <h1 className='text-3xl font-bold'>Attributions</h1>
                <p>Last updated March 31, 2025</p>
                <p>Below is a list of software which Flippify has used which requires attribution.</p>
                <p>We aim to attribute all the software which we have used that we have not created, however it is possible we have missed/forgotten some. If you notice this, please contact us immediately so we can give the proper attribution to the creator/artist.</p>
            </section>

            <section className='space-y-4'>
                <h1 className='text-lg font-bold'>Storyset</h1>

                <p>
                    The illustrations used in this website are powered by <Link className='text-blue-600 hover:underline' href="https://storyset.com/" target="_blank" rel="noopener noreferrer">Storyset</Link>.
                    Storyset provides high-quality illustrations that enhance the visual appeal of our website.
                </p>

                <p>
                    Although we have a premium subscription and are not required to attribute, we still wish to give credit to Storyset for their amazing work and resources. You can find more of their free and premium illustrations at <Link className='text-blue-600 hover:underline' href="https://storyset.com/" target="_blank" rel="noopener noreferrer">Storyset</Link>.
                </p>

                <p className="text-sm text-gray-500">
                    Illustration credits: Storyset by Freepik
                </p>
            </section>

            <section className='space-y-4'>
                <h1 className='text-lg font-bold'>UIVerse Animations</h1>
                <div className='flex flex-col gap-4 p-4'>
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
                </div>
            </section>


            <section className='space-y-4'>
                <h1 className='text-lg font-bold'>React Icons</h1>

                <p>
                    The icons used throughout this website are provided by <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer">React Icons</a>.
                    React Icons offers a wide variety of customizable icons that have been integrated into our design to enhance usability and visual appeal.
                </p>

                <p>
                    While we benefit from their open-source library, we want to ensure React Icons is credited for providing such a fantastic set of icons for developers and designers.
                </p>

                <p className="text-sm text-gray-500">
                    Icon credits: <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer">React Icons</a>
                </p>
            </section>
        </div >
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
