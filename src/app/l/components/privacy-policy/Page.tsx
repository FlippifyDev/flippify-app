import React from 'react'
import Hero from '../dom/Hero'
import Policy from './Policy'

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <Hero
                text={[
                    { text: "Your privacy ", isGradient: false },
                    { text: "matters", isGradient: true },
                    { text: " to us." }
                ]}
                description="We’re committed to protecting your data and being transparent about how we use it. Learn how Flippify collects, stores, and safeguards your information while you grow your eBay business."
                image="/hero/privacyPolicy.svg"
                imageAlt="Privacy and Security"
                imageContainerClassName='pb-20 scale-150'
            />
            <div className='max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4'>
                <Policy />
            </div>
        </div>
    )
}

export default Page
