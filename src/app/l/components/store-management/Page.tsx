import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <Hero
                text={[
                    { text: "Effortless" },
                    { text: "Store Management", isGradient: true },
                    { text: "with Flippify" }
                ]}
                description="Flippify offers an intuitive and powerful store management system that allows you to easily modify and customize your eBay store. Whether you&apos;re adjusting product listings, syncing stock, or optimizing your sales processes, Flippify gives you the control and flexibility you need to grow your business with ease."
                image="/hero/storeManagement.svg"
                imageAlt="Store Management"
                imageContainerClassName='pb-20 scale-150'
                button={<HomeGetAccess />}
            />
            <div className={`${inter.className} font-semibold text-lightModeText max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4`}>
                <p>Stay tuned this page is still under development!</p>
            </div>
        </div>
    )
}

export default Page
