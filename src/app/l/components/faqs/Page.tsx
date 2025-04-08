import React from 'react'
import Hero from '../dom/Hero'

const Page = () => {
    return (
        <div className='min-h-screen'>
            <Hero
                text={[
                    { text: "Got ", isGradient: false },
                    { text: "Questions?", isGradient: true },
                    { text: " We have answers!" }
                ]}
                description="Find answers to the most common questions about Flippify. Whether you need help getting started, managing your store, or using specific features, our FAQs provide clear and concise information to assist you."
                image="/hero/faqs.svg"
                imageAlt="Frequently Asked Questions"
                imageContainerClassName='pb-20 scale-150'
            />
        </div>
    )
}

export default Page
