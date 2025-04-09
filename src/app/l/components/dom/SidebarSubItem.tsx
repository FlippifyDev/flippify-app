import Link from 'next/link'
import React from 'react'

interface SidebarSubItemProps {
    text: string
    href: string
    icon: React.ReactNode
}

const SidebarSubItem: React.FC<SidebarSubItemProps> = ({ text, href, icon }) => {
    return (
        <li>
            <Link href={href} className='text-sm flex flex-row items-center gap-3 p-3 rounded-md active:bg-gray-100'>
                <span className='col-span-1 rounded-none'>{icon}</span>
                <span className='col-span-11 rounded-none'>{text}</span>
            </Link>
        </li>
    )
}

export default SidebarSubItem
