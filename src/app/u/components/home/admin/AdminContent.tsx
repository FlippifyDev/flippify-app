"use client";

// Local Imports
import { retrieveProducts } from "@/services/firebase/retrieve";
import PlansCardAdmin from "@/app/u/components/home/admin/AdminUserCards";
import LayoutProductsSkeleton from "../../layout/LayoutProductsSkeleton";
import { IUser, ISubscription } from "@/models/user";

// External Imports
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

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
                const uniqueSubscriptions = await retrieveProducts();
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
                const username = user?.username?.toLowerCase() as string;
                const stripeCustomerId = user?.stripeCustomerId?.toLowerCase();
                const email = user.email?.toLowerCase();

                return (
                    username.includes(lowercasedQuery) ||
                    stripeCustomerId?.includes(lowercasedQuery) ||
                    email?.includes(lowercasedQuery)
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
                                <PlansCardAdmin key={user.id?.toString()} user={user} unique_subscriptions={subscriptions} />
                            ))}
                        </div>
                    ) : (
                        <LayoutProductsSkeleton />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminContent;
