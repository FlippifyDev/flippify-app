import React from 'react'

const LayoutLoadingSkeleton = () => {
	return (
		<div role="status" className="w-full animate-pulse">
			<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
				<div className="col-span-1 h-24 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
				<div className="col-span-1 h-24 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
				<div className="col-span-1 h-24 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
				<div className="col-span-1 h-24 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
			</div>
			<div className="mt-2 col-span-1 h-[31rem] bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
			<div className="mt-2 col-span-1 h-[200px] bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>

			<span className="sr-only">Loading...</span>
		</div>
	)
}

export default LayoutLoadingSkeleton
