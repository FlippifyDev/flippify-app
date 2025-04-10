import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <div>
                <Hero
                    text={[{ text: "Smart Order " }, { "text": "Management", isGradient: true }, { text: "for your eBay business" }]}
                    description="Flippify’s order management software helps eBay sellers automate orders, track shipments, and manage stock."
                    button={<HomeGetAccess />}
                    image="/hero/orderManagement.svg"
                    imageAlt="Flippify Order Management"
                    imageContainerClassName="scale-150"
                />
            </div>
            <div className={`${inter.className} font-semibold text-lightModeText max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4`}>
                <p>Stay tuned this page is still under development!</p>
            </div>
        </div>
    )
}

export default Page
