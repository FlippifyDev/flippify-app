import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div>
            <div>
                <Hero
                    text={[{ text: "Smart Inventory " }, { "text": "Control", isGradient: true }, { text: "for eBay" }]}
                    description="Flippify’s inventory software keeps your stock synced with eBay whilst allowing you to upload your own custom stock. Track levels in real-time, avoid overselling, and manage your warehouse with ease."
                    button={<HomeGetAccess />}
                    image="/hero/inventoryManagementSoftware.png"
                    imageAlt="Flippify Inventory Management"
                    imageContainerClassName="scale-150"
                    imageClassName='pb-20'
                />
            </div>
        </div>
    )
}

export default Page
