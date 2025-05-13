import AnimationArrow from '@/app/components/AnimationArrow'
import Link from 'next/link'
import React from 'react'

interface BlogItemProps {
    title: string;
    description: string;
    link: string;
    date: string;
}

const BlogItem: React.FC<BlogItemProps> = ({ title, description, link, date }) => {
    return (
        <Link href={`/l/blog/${link}`} className='col-span-1 max-w-lg group select-none flex flex-row items-center bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-200'>
            <div>
                <h3 className="text-xl font-semibold">
                    {title}
                </h3>
                <p className="mt-2 text-gray-600">
                    {description}
                </p>
                <time
                    dateTime="2025-05-13"
                    className="mt-4 block text-sm text-gray-500"
                >
                    {date}
                </time>
            </div>
            <span className="ml-4">
                <AnimationArrow className='text-gray-600' />
            </span>
        </Link>
    )
}

export default BlogItem
