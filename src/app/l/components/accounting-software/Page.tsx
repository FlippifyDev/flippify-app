import React from 'react'
import Hero from '../dom/Hero'
import HomeGetAccess from '../home/HomeGetAccess'

const Page = () => {
    return (
        <div>
            <div>
                <Hero 
                    text={[{ text: "Master your finances with" }, { "text": "Flippify’s expert", isGradient: true }, { "text": "Accounting Software"}]}
                    description="Flippify’s accounting software helps eBay sellers automate taxes, track expenses, and manage stock. Export CSVs in one click and stay tax compliant as you grow."
                    button={<HomeGetAccess />}
                    image="/hero/accountingSoftware.png"
                    imageAlt="Flippify Inventory Management"
                    titleClassName="lg:w-3/5"
                />
            </div>
        </div>
    )
}

export default Page
