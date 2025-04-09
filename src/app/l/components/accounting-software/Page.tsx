import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <div>
                <Hero 
                    text={[{ text: "Master your finances with" }, { "text": "Flippify’s expert", isGradient: true }, { "text": "Accounting Software"}]}
                    description="Flippify’s accounting software helps eBay sellers automate taxes, track expenses, and manage stock. Export CSVs in one click and stay tax compliant as you grow."
                    button={<HomeGetAccess />}
                    image="/hero/accountingSoftware.svg"
                    imageAlt="Flippify Inventory Management"
                    titleClassName="lg:w-3/5"
                />
            </div>
            <div className='max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4'>
                <p>Stay tuned this page is still under development!</p>
            </div>
        </div>
    )
}

export default Page
