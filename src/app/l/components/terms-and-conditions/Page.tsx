import React from 'react'
import Hero from '../dom/Hero'
import Terms from './Terms'

const Page = () => {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <Hero
                text={[
                    { text: "Simple ", },
                    { text: "terms,", isGradient: true },
                    { text: "solid foundations" }
                ]}
                description="Our terms and conditions are here to protect both you and us. Read the rules that guide the use of Flippify’s tools and services—clear, fair, and built for trust."
                image="/hero/termsAndConditions.svg"
                imageAlt="Terms and Conditions Document"
                imageContainerClassName='scale-150'
                imageClassName='pb-64'
            />

            <div className='max-w-6.5xl mt-[16rem] md:mt-0 2xl:mt-[4rem] px-8 md:px-4'>
                <Terms />
            </div>
        </div>
    )
}

export default Page
