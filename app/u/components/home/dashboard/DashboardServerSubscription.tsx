import React from 'react'

interface Props {
  customerId: string
}

const DashboardServerSubscription: React.FC<Props> = ({ customerId }) => {
  return (
    <div className='w-full text-center mt-20'>
        <p>The dashboard for your server subscription is under development...</p>
        <br /> 
        <p>If you want to get pings in your server then navigate to the Manage Servers tab.</p>
        <br />
        <strong className='text-xl'>Important</strong>
        <p>If you cannot see the Manage Servers tab contact support on Discord as soon as possible.</p>
    </div>
  )
}

export default DashboardServerSubscription
