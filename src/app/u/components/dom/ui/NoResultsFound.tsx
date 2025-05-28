import React from 'react'
import { PiMagnifyingGlassBold } from 'react-icons/pi'

const NoResultsFound = () => {
    return (
        <div className='flex flex-col items-center text-center gap-2 max-w-72'>
            <div className='mb-2'>
                <PiMagnifyingGlassBold className='text-houseBlue text-2xl'/>
            </div>
            <p className='font-semibold'>No results found</p>
            <p className='text-xs text-gray-500 font-[530]'>We couldn't find any results, try searching for something else or adding a new item.</p>
        </div>
    )
}

export default NoResultsFound
