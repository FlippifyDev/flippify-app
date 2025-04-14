import React from 'react';
import Hero from '../dom/Hero';
import { Inter } from 'next/font/google';
import FAQQuestions from './FAQQuestions';
import FAQMoreSupport from './FAQMoreSupport';

const inter = Inter({ subsets: ['latin'] });

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
                imageContainerClassName='pb-20 scale-125'
            />

            <div className={`${inter.className} w-full mt-[10rem] xs:mt-[6rem] sm:mt-[8rem] md:mt-[10rem] lg2:mt-0 2xl:mt-[4rem]`}>
                <div className="py-20">
                    <FAQQuestions />
                </div>
                <div>
                    <FAQMoreSupport />
                </div>
            </div>
        </div>
    );
}

export default Page;