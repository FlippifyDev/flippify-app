import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div className='min-h-screen'>
            <Hero
                text={[
                    { text: "Effortless" },
                    { text: "Store Management", isGradient: true },
                    { text: "with Flippify" }
                ]}
                description="Flippify offers an intuitive and powerful store management system that allows you to easily modify and customize your eBay store. Whether you’re adjusting product listings, syncing stock, or optimizing your sales processes, Flippify gives you the control and flexibility you need to grow your business with ease."
                image="/hero/storeManagement.svg"
                imageAlt="Store Management"
                imageContainerClassName='pb-20 scale-150'
                button={<HomeGetAccess />}
            />
        </div>
    )
}

export default Page
