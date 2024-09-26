import React, { useState, ChangeEvent, FocusEvent, useRef, useEffect } from 'react';
import { IUser, ISubscription } from '@/app/api/auth-mongodb/userModel';
import Alert from '@/app/components/Alert';

interface CardProps {
  user: IUser;
  unique_subscriptions: ISubscription[];
}

const PlansCardAdmin: React.FC<CardProps> = ({ user, unique_subscriptions }) => {
  const username = user.username;
  const email = user.email;
  const discordId = user.discord_id;
  const stripeCustomerId = user.stripe_customer_id;
  const subscriptions = user.subscriptions;
  const _id = user._id;

  const referral = user.referral || {
    referral_code: '',
    referral_count: 0,
    valid_referrals: [],
    rewards_claimed: 0,
  };

  const [newEmail, setNewEmail] = useState(email);
  const [selectedRoles, setSelectedRoles] = useState<ISubscription[]>(
    subscriptions.map(sub => ({
      name: sub.name,
      role_id: sub.role_id.toString(),
      override: sub.override,
      server_subscription: sub.server_subscription,
    }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input

  // Referral state
  const [referralCode, setReferralCode] = useState(referral.referral_code);
  const [referralCount, setReferralCount] = useState(referral.referral_count);
  const [rewardsClaimed, setRewardsClaimed] = useState(referral.rewards_claimed);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value);

  const handleReferralChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (field === 'referralCode') setReferralCode(value);
    if (field === 'referralCount') setReferralCount(parseInt(value) || 0);
    if (field === 'rewardsClaimed') setRewardsClaimed(parseInt(value) || 0);
  };

  const isRoleSelected = (roleName: string) => selectedRoles.some(role => role.name === roleName);

  const handleRoleChange = (role: ISubscription) => {
    setSelectedRoles(prevRoles =>
      isRoleSelected(role.name)
        ? prevRoles.filter(r => r.name !== role.name) // Deselect the role
        : [...prevRoles, role] // Select the role
    );
    // Do not close the dropdown here
  };

  const [alertVisible, setAlertVisible] = useState(false);

  const handleUpdate = async () => {
    try {
      const payload = {
        _id: _id,
        email: newEmail,
        subscriptions: selectedRoles,
        referral: {
          referral_code: referralCode,
          referral_count: referralCount,
          rewards_claimed: rewardsClaimed,
        },
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

      setAlertVisible(true); // Show the alert on success
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const filteredRoles = unique_subscriptions.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFocus = () => setIsDropdownOpen(true);

  // Handle click outside to close dropdown
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget;
    if (
      dropdownRef.current && 
      inputRef.current && 
      !dropdownRef.current.contains(relatedTarget as Node) &&
      !inputRef.current.contains(relatedTarget as Node)
    ) {
      setTimeout(() => setIsDropdownOpen(false), 100);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target as Node) && 
      inputRef.current && 
      !inputRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // Adding event listener for clicks outside of dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="card bg-base-100 sm:w-96 w-86 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{username}</h2>
        <hr />
        <p className="grid grid-cols-12">
          <span className="col-span-4">Email: </span>
          <span className="col-span-8">{email}</span>
        </p>
        <p className="grid grid-cols-12">
          <span className="col-span-4">Discord ID: </span>
          <span className="col-span-8">{discordId}</span>
        </p>
        <p className="grid grid-cols-12">
          <span className="col-span-4">Stripe ID: </span>
          <span className="col-span-8">{stripeCustomerId}</span>
        </p>
        <hr />

        {/* Referral Information Editable */}
        <div className="referral-info">
          <h3 className="font-semibold mb-4">Referral Information</h3>
          <div className="grid grid-cols-12 gap-2">
            <label className="col-span-6 flex items-center">Referral Code:</label>
            <input
              className="input input-bordered col-span-6"
              value={referralCode}
              onChange={(e) => handleReferralChange(e, 'referralCode')}
            />
          </div>
          <div className="grid grid-cols-12 gap-2 mt-2">
            <label className="col-span-6 flex items-center">Referral Count:</label>
            <input
              type="number"
              className="input input-bordered col-span-6"
              value={referralCount}
              onChange={(e) => handleReferralChange(e, 'referralCount')}
            />
          </div>
          <div className="grid grid-cols-12 gap-2 mt-2">
            <label className="col-span-6 flex items-center">Rewards Claimed:</label>
            <input
              type="number"
              className="input input-bordered col-span-6"
              value={rewardsClaimed}
              onChange={(e) => handleReferralChange(e, 'rewardsClaimed')}
            />
          </div>
        </div>
        <hr />

        {/* Search Input */}
        <div className="relative mt-2">
          <h3 className="mb-2 font-semibold">Update Roles</h3>
          <input
            ref={inputRef} // Set ref for input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input input-bordered w-full"
          />
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute z-10 bg-base-100 border overflow-y-auto rounded-box shadow-lg w-full mt-1 max-h-48 overflow-hidden">
              <ul className="menu p-2 overflow-y-auto max-h-full pt-0">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map(role => (
                    <li key={role.name} className="grid grid-cols-12 items-center space-x-2">
                      <span className="col-span-10 truncate">{role.name}</span>
                      <input
                        type="checkbox"
                        checked={isRoleSelected(role.name)}
                        onChange={() => handleRoleChange(role)} // Keep the dropdown open
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
          <button
            className="btn bg-houseBlue text-white hover:bg-houseHoverBlue mt-6"
            onClick={handleUpdate}
          >
            Update
          </button>
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
