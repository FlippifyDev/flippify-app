import React from 'react'
import Hero from '../dom/Hero'

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
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

            <div className='max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4'>
                <p>Stay tuned this page is still under development!</p>
            </div>
        </div>
    )
}

export default Page
