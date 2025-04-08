import React from 'react'
import Hero from '../dom/Hero'

const Page = () => {
    return (
        <div className='min-h-screen'>
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
        </div>
    )
}

export default Page
