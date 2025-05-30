import React from 'react'
import DashboardStatsGrid from './DashboardStatsGrid'
import TransactionChart from './TransactionChart'
import BuyerProfilePieChart from './BuyerProfilePieChart'
import RecentOrders from './RecentOrders'
import PopularProducts from './PopularProducts'


export default function Dashboard() {
	return (
		<div className="flex flex-col gap-4 mt-20 pt-2 mr-4 mb-4">
			<DashboardStatsGrid />
			<div className="flex flex-row gap-4 w-full">
				<TransactionChart />
				{/* <BuyerProfilePieChart/> */}
			</div>
			<div className="flex flex-row gap-4 w-full">
				<RecentOrders />
				{/* <PopularProducts /> */}
			</div>
		</div>
	)
}
