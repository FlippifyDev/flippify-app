import React from 'react'


const SkeletonItem = () => {
  return (
    <div>
        <div className="w-full h-[29rem] bg-gray-200 rounded-md mb-2.5"></div>
        <span className="sr-only">Loading...</span>
    </div>
  )
}

const LayoutProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-10 items-center">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
    </div>
  )
}

export default LayoutProductsSkeleton
