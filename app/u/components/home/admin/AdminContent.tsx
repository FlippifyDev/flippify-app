'use client';

import { IUser, ISubscription } from 'app/api/auth-mongodb/userModel';
import PlansCardAdmin from '@/app/u/components/home/admin/AdminUserCards';
import fetchProducts from '@/app/api/auth-mongodb/fetchProducts';
import LayoutProductsSkeleton from '../../layout/LayoutProductsSkeleton';

import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from 'react';

const AdminContent = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const uniqueSubscriptions = await fetchProducts();
        setUsers(data.users || []);
        setSubscriptions(uniqueSubscriptions || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredUsers(users.filter(user => {
      const username = user.username.toLowerCase();
      const stripeCustomerId = user.stripe_customer_id.toLowerCase();
      const discordId = user.discord_id.toLowerCase();
      const email = user.email.toLowerCase();

      return username.includes(lowercasedQuery) ||
             stripeCustomerId.includes(lowercasedQuery) ||
             discordId.includes(lowercasedQuery) ||
             email.includes(lowercasedQuery);
    }));
  }, [searchQuery, users]);

  return (
    <div className='w-full p-5'>
      <label className="input input-bordered flex items-center gap-2 w-80 mb-8 text-xl">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="grow border-0 input input-bordered"
        />
        <IoSearch />
      </label>
      {filteredUsers.length > 0 ? (
        <div className="flex flex-wrap gap-20 justify-center">
          {filteredUsers.map((user) => (
            <PlansCardAdmin
              key={user._id.toString()}
              user={user}
              unique_subscriptions={subscriptions}
            />
          ))}
        </div>
      ) : (
        <LayoutProductsSkeleton />
      )}
    </div>
  );
};



export default AdminContent;
