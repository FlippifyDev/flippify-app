import React from 'react'

interface OrderInfoCardProps {
	title: string;
	value: string
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ title, value }) => {
	return (
		<div className="col-span-1 stats shadow-sm bg-white flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
			<div className="stat">
				<div className="stat-title font-semibold text-sm sm:text-base text-houseBlue text-wrap">{title}</div>
				<div className="stat-value font-bold text-xl sm:text-2xl text-black">
					{value}
				</div>
			</div>
		</div>
	)
}

export default OrderInfoCard
