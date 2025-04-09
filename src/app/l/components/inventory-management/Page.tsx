import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <div>
                <Hero
                    text={[{ text: "Smart Inventory " }, { "text": "Control", isGradient: true }, { text: "for eBay" }]}
                    description="Flippify’s inventory software keeps your stock synced with eBay whilst allowing you to upload your own custom stock. Track levels in real-time, avoid overselling, and manage your warehouse with ease."
                    button={<HomeGetAccess />}
                    image="/hero/inventoryManagement.svg"
                    imageAlt="Flippify Inventory Management"
                    imageContainerClassName="scale-150"
                    imageClassName='pb-20'
                />
            </div>
            <div className='max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4'>
                <p>Stay tuned this page is still under development!</p>
            </div>
        </div>
    )
}

export default Page
