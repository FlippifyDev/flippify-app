import React from 'react'
import Hero from '../dom/Hero'
import AnimationArrow from '@/app/components/AnimationArrow'
import Link from 'next/link'
import BlogItem from './BlogItem'

const Page = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center overflow-x-auto scrollbar-hide">
            <div>
                <Hero
                    text={[
                        { text: "Discover " },
                        { text: "How To", isGradient: true },
                        { text: "Use Flippify" }
                    ]}
                    description="Learn how to make the most of Flippify with expert tips, feature guides, and reseller success stories—all in one place."
                    image="/blog/Hero.svg"
                    imageAlt="Illustration of people exploring articles and tips on how to use Flippify effectively"
                    imageContainerClassName='pb-20 scale-125'
                    titleClassName="lg:w-3/5"
                />
            </div>

            <div className='min-h-screen max-w-6.5xl px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-fadeInBounce mt-[250px] xs:mt-[200px] sm:mt-[200px] md:mt-[250px] lg:mt-[270px] 2xl:mt-[320px] mb-12'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <BlogItem title="How To Upload Sales Data" description="A step‑by‑step guide to importing your sales records into Flippify—get up and running in minutes." link="how-to-upload-sales" date="May 11, 2025" />
                </div>
            </div>
        </div>

    )
}

export default Page
