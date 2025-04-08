import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div>
            <div>
                <Hero
                    text={[{ text: "Smart Order " }, { "text": "Management", isGradient: true }, { text: "for your eBay business" }]}
                    description="Flippify’s inventory software keeps your stock synced with eBay whilst allowing you to upload your own custom stock. Track levels in real-time, avoid overselling, and manage your warehouse with ease."
                    button={<HomeGetAccess />}
                    image="/hero/orderManagement.png"
                    imageAlt="Flippify Order Management"
                    imageContainerClassName="scale-150"
                />
            </div>
        </div>
    )
}

export default Page
