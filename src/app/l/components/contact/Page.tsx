import React from 'react'
import Hero from '../dom/Hero'
import Email from './Email'

const Page = () => {
    return (
        <div className='min-h-screen'>
            <div>
                <Hero
                    text={[
                        { text: "Get in", isGradient: false },
                        { text: "Touch", isGradient: true },
                        { text: "with Us" }
                    ]}
                    description="Have questions or need support? Our team is here to help! Reach out to us for any inquiries, and we’ll get back to you as soon as possible."
                    image="/hero/contact.svg"
                    imageAlt="Contact Us"
                    imageContainerClassName="scale-150"
                    imageClassName="pb-20"
                    button={<Email />}
                />
            </div>
        </div>
    )
}

export default Page
