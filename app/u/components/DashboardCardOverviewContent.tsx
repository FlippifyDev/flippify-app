import React from 'react'


interface DashboardOverviewContentProps {
    type: string
}

const DashboardOverviewContent: React.FC<DashboardOverviewContentProps> = ({ type }) => {
    return (
        <div className="card-body w-full mb-10">
            <div className="w-full flex flex-wrap justify-center gap-4 sm:px-2 md:gap-8 text-xs sm:text-sm text-lightModeText font-semibold">
                <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                    <div className="stat">
                    <div className="stat-title text-houseBlue">Total Revenue</div>
                    <div className="stat-value text-2xl text-black">£349.98</div>
                    </div>
                </div>
                <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                    <div className="stat">
                    <div className="stat-title text-houseBlue">Total Costs</div>
                    <div className="stat-value text-2xl text-black">£151.98</div>
                    </div>
                </div>
                <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                    <div className="stat">
                    <div className="stat-title text-houseBlue">Net Profit</div>
                    <div className="stat-value text-2xl text-black">£198.00</div>
                    </div>
                </div>
                <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                    <div className="stat">
                    <div className="stat-title text-houseBlue">No. Sales</div>
                    <div className="stat-value text-2xl text-black">2</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverviewContent
