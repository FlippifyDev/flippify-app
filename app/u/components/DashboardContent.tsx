import React from 'react'
import DashboardSubscriptionsCard from './DashboardSubscriptionsCard'
import DashboardAnalyticsCard from './DashboardAnalyticsCard'
import DashboardOverviewCard from './DashboardOverviewCard'

const DashboardContent = () => {
  return (
    <div className='grid gap-4 grid-cols-12'>
        <div className='col-span-12 lg:col-span-4'>
            <DashboardSubscriptionsCard />
        </div>
        <div className='col-span-12 lg:col-span-8 pointer-events-none opacity-70'>
            <DashboardOverviewCard />
        </div>
        <div className='col-span-12 pointer-events-none opacity-70'>
            <DashboardAnalyticsCard />
        </div>
    </div>
  )
}

export default DashboardContent
