import React from 'react'
import Hero from '../dom/Hero'

const Page = () => {
    return (
        <div className='min-h-screen'>
            <div>
                <Hero
                    text={[
                        { text: "Built for " },
                        { text: "sellers,", isGradient: true },
                        { text: "by sellers" }
                    ]}
                    description="At Flippify, we understand the grind—because we’ve lived it. Our team of former online sellers is on a mission to make selling on eBay easier, smarter, and more profitable. We build tools we wish we had—simple, powerful, and made for real businesses."
                    image="/hero/about.svg"
                    imageAlt="Flippify Team and Mission"
                    imageContainerClassName='pb-20 scale-125'
                />
            </div>
        </div>
    )
}

export default Page
