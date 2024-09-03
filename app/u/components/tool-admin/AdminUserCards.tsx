import React, { useState, ChangeEvent, FocusEvent } from 'react';

import { IUser, ISubscriptionSimple } from '@/app/api/auth-mongodb/userModel';
import Alert from '../../../components/Alert';


interface CardProps {
  user: IUser;
  unique_subscriptions: ISubscriptionSimple[];
}

const PlansCardAdmin: React.FC<CardProps> = ({ user, unique_subscriptions }) => {
  const username = user.username;
  const referral = user.referral;
  const email = user.email;
  const discordId = user.discord_id;
  const stripeCustomerId = user.stripe_customer_id;
  const subscriptions = user.subscriptions;
  const _id = user._id;

  let userSubscriptions = [] as ISubscriptionSimple[];
  subscriptions.forEach(sub => {
    const sub_role_id = sub.role_id.toString();
    userSubscriptions.push({
      name: sub.name,
      role_id: sub_role_id,
      override: sub.override,
      server_subscription: sub.server_subscription
    });
  });

  const [newEmail, setNewEmail] = useState(email);
  const [selectedRoles, setSelectedRoles] = useState<ISubscriptionSimple[]>(userSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  const isRoleSelected = (roleName: string) => selectedRoles.some(role => role.name === roleName);

  const handleRoleChange = (role: ISubscriptionSimple) => {
    setSelectedRoles(prevRoles =>
      isRoleSelected(role.name)
        ? prevRoles.filter(r => r.name !== role.name)
        : [...prevRoles, role]
    );
  };

  const [alertVisible, setAlertVisible] = useState(false);

  const handleUpdate = async () => {
    try {
      const payload = {
        _id: _id,
        email: newEmail,
        subscriptions: selectedRoles,
      };
      console.log('Sending payload:', payload);

      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update user data');
      }

    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setAlertVisible(true); // Show the alert
    }
  };

  const filteredRoles = unique_subscriptions.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dropdown visibility on focus and blur
  const handleFocus = () => setIsDropdownOpen(true);
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Delay hiding to allow click event on dropdown items
    setTimeout(() => setIsDropdownOpen(false), 100);
  };

  return (
    <div className="card bg-base-100 sm:w-96 w-86 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{username}</h2>
        <hr />
        <p className='grid grid-cols-12'><span className='col-span-4'>Email: </span><span className='col-span-8'>{email}</span></p>
        <p className='grid grid-cols-12'><span className='col-span-4'>Discord ID: </span><span className='col-span-8'>{discordId}</span></p>
        <p className='grid grid-cols-12'><span className='col-span-4'>Stripe ID: </span><span className='col-span-8'>{stripeCustomerId}</span></p>
        <hr />

        {/* Displaying Referral Data Safely */}
        {referral ? (
          <div className="referral-info ">
            <h3 className="font-semibold">Referral Information</h3>
            <p className='grid grid-cols-12'><span className='col-span-6'>Referral Code:   </span><span className='col-span-6'>{referral.referral_code}</span></p>
            <p className='grid grid-cols-12'><span className='col-span-6'>Referral Count:  </span><span className='col-span-6'>{referral.referral_count}</span></p>
            <p className='grid grid-cols-12'><span className='col-span-6'>Rewards Claimed: </span><span className='col-span-6'>{referral.rewards_claimed}</span></p>
          </div>
        ) : (
          <p>No referral information available.</p>
        )}
        <hr />

        {/* Search Input */}
        <div className="relative mt-2">
          <h3 className='mb-2 font-semibold'>Update Roles</h3>
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input input-bordered w-full"
          />

          {/* Dropdown with Search */}
          {isDropdownOpen && (
            <div className="absolute z-10 bg-base-100 border overflow-y-auto rounded-box shadow-lg w-full mt-1 max-h-48 overflow-hidden">
              <ul className="menu p-2 overflow-y-auto max-h-full pt-0">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map(role => (
                    <li key={role.name} className="grid grid-cols-12 items-center space-x-2">
                      <span className="col-span-10 truncate">{role.name}</span>
                      <input
                        type="checkbox"
                        checked={isRoleSelected(role.name)}
                        onChange={() => handleRoleChange(role)}
                        className="checkbox col-span-2"
                      />
                    </li>
                  ))
                ) : (
                  <li><span className="col-span-12 truncate">No roles found</span></li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Update Form */}
        <div className="form-control mt-2">
          <h2 className="label font-semibold">New Email</h2>
          <input
            type="email"
            className="input input-bordered"
            value={newEmail}
            onChange={handleEmailChange}
          />
          <button className="btn bg-houseBlue text-white hover:bg-houseHoverBlue mt-6" onClick={handleUpdate}>Update</button>
        </div>

        {/* Alert Component */}
        <Alert
          message="Update Successful!"
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </div>
    </div>
  );
};

export default PlansCardAdmin;
