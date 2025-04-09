import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div className='min-h-screen'>
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
        </div>
    )
}

export default Page
