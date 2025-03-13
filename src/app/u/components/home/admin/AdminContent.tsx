"use client";

import { IUser, ISubscription } from "@/models/mongodb/users";
import PlansCardAdmin from "@/app/u/components/home/admin/AdminUserCards";
import fetchProducts from "@/services/mongodb/fetch-products";
import LayoutProductsSkeleton from "../../layout/LayoutProductsSkeleton";
import AdminEventManagement from "./AdminEventManagement";
import AdminNotificationManagement from "./AdminNotificationManagement";
import AdminResellerNewsManagement from "./AdminResellerNewsManagement";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";

const AdminContent = () => {
	const [users, setUsers] = useState<IUser[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
	const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [activeTab, setActiveTab] = useState("userDatabase");

	useEffect(() => {
		async function fetchUsers() {
			try {
				const res = await fetch("/api/users");
				if (!res.ok) throw new Error("Network response was not ok");
				const data = await res.json();
				const uniqueSubscriptions = await fetchProducts();
				setUsers(data.users || []);
				setSubscriptions(uniqueSubscriptions || []);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		}

		fetchUsers();
	}, []);

	useEffect(() => {
		const lowercasedQuery = searchQuery.toLowerCase();
		setFilteredUsers(
			users.filter((user) => {
				const username = user.username.toLowerCase();
				const stripeCustomerId = user.stripe_customer_id.toLowerCase();
				const discordId = user.discord_id.toLowerCase();
				const email = user.email.toLowerCase();

				return (
					username.includes(lowercasedQuery) ||
					stripeCustomerId.includes(lowercasedQuery) ||
					discordId.includes(lowercasedQuery) ||
					email.includes(lowercasedQuery)
				);
			})
		);
	}, [searchQuery, users]);

	return (
		<div className="w-full p-5">
			{/* Tab Navigation */}
			<div className="flex space-x-8 mb-5 flex-col sm:flex-row ">
				<button
					className={`font-semibold ${activeTab === "userDatabase" ? "text-blue-600" : "text-gray-600"}`}
					onClick={() => setActiveTab("userDatabase")}
				>
					User Database
				</button>
				<button
					className={`font-semibold ${activeTab === "eventManagement" ? "text-blue-600" : "text-gray-600"}`}
					onClick={() => setActiveTab("eventManagement")}
				>
					Event Management
				</button>
				<button
					className={`font-semibold ${activeTab === "notificationManagement" ? "text-blue-600" : "text-gray-600"}`}
					onClick={() => setActiveTab("notificationManagement")}
				>
					Notification Management
				</button>
				<button
					className={`font-semibold ${activeTab === "resellerNewsManagement" ? "text-blue-600" : "text-gray-600"}`}
					onClick={() => setActiveTab("resellerNewsManagement")}
				>
					Reseller News Management
				</button>
			</div>

			{activeTab === "userDatabase" && (
				<div>
					<div className="flex justify-center mb-4">
						<label className="input input-bordered flex items-center gap-2 w-80 text-xl">
							<input
								type="text"
								placeholder="Search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="grow border-0 input input-bordered"
							/>
							<IoSearch />
						</label>
					</div>
					{filteredUsers.length > 0 ? (
						<div className="flex flex-wrap gap-20 justify-center">
							{filteredUsers.map((user) => (
								<PlansCardAdmin key={user._id.toString()} user={user} unique_subscriptions={subscriptions} />
							))}
						</div>
					) : (
						<LayoutProductsSkeleton />
					)}
				</div>
			)}

			{activeTab === "eventManagement" && <AdminEventManagement />}
			{activeTab === "notificationManagement" && <AdminNotificationManagement />}
			{activeTab === "resellerNewsManagement" && <AdminResellerNewsManagement />}
		</div>
	);
};

export default AdminContent;
