import React from 'react'
import DashboardSubscriptionsCard from './DashboardCardSubscriptions'
import DashboardAnalyticsCard from './DashboardCardAnalytics'
import DashboardOverviewCard from './DashboardCardOverview'

const DashboardPage = () => {
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

export default DashboardPage
