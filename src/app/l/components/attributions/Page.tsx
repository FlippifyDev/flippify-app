import React from 'react'
import Hero from '../dom/Hero'

const Page = () => {
    return (
        <div className='min-h-screen'>
            <Hero
                text={[
                    { text: "Credits & ", isGradient: false },
                    { text: "Attributions", isGradient: true }
                ]}
                description="Flippify proudly uses open-source tools, licensed assets, and community-powered tech. Here’s a full list of the creators and resources that help power our platform."
                image="/hero/attributions.svg"
                imageAlt="Creative and Technical Attributions"
                imageContainerClassName='scale-150'
                imageClassName='pb-64'
            />
        </div>
    )
}

export default Page
