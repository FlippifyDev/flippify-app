import React from 'react'
import Hero from '../dom/Hero'
import AboutOverview from './AboutOverview'

const Page = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <Hero
                text={[
                    { text: "Built for " },
                    { text: "sellers,", isGradient: true },
                    { text: "by sellers" }
                ]}
                description="Flippify gets the seller grind—we’ve lived it. Ex-sellers building simple, smart tools to make eBay selling easier and more profitable."
                image="/hero/about.svg"
                imageAlt="Flippify Team and Mission"
                imageContainerClassName='pb-20 scale-125'
            />

            <div className="flex flex-col mt-[250px] xs:mt-[200px] sm:mt-[200px] md:mt-[250px] lg:mt-[200px]">
                <AboutOverview />
            </div>
        </div>
    )
}

export default Page
