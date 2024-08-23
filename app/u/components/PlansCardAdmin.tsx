

// components/Card.tsx
import React, {useState} from 'react';

type Role = {
  name: string;
  role_id?: number | string;
  override?: boolean;
  server_subscription?: boolean;
};

type Referral = {
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  rewards_claimed: number;
  valid_referral_count: number;
  valid_referrals: any[];
};

interface CardProps {
  username: string;
  email: string;
  stripeCustomerId: string;
  discord_id: number;
  _id:string;
  referral?:Referral;
  subscriptions: Role[];
  // Add more props as needed
} // Use a default placeholder or hash if available

const PlansCardAdmin: React.FC<CardProps> = ({ username, email, stripeCustomerId, discord_id, _id, referral, subscriptions}) => {
    const avatarUrl = `https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-wooh9l0j.png`;
    const [newEmail, setNewEmail] = useState(email);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(subscriptions);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
      };
      // Check if a role is currently selected
      const isRoleSelected = (roleName: string) => 
      selectedRoles.some(role => role.name === roleName);

      const handleRoleChange = (role: Role) => {
        setSelectedRoles(prevRoles =>
          isRoleSelected(role.name)
            ? prevRoles.filter(r => r.name !== role.name)
            : [...prevRoles, role]
        );
      };

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
    
          setSuccess('User data updated successfully');
          setError(null);
        } catch (error) {
          console.error('Error updating user data:', error);
          setError('Failed to update user data');
          setSuccess(null);
        }
      };

      // Define all possible roles
  const allRoles: Role[] = [
    { name: 'accessGranted' },
    { name: 'Flippify Standard User' },
    { name: 'Deal Watch UK - Server' },
    { name: 'Retiring Sets Deals - Server' },
    // Add other roles here...
  ];
      
  return (
    

    <div className="card bg-base-100 w-96 shadow-xl">
    <figure>
      <img
        src={ avatarUrl }
        alt="Shoes" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{ username }</h2>
      <p> {email }</p>
      <p> { stripeCustomerId }</p>
      <p> { discord_id } Error here</p>
      <p> { _id } </p>
      {/* Displaying Referral Data Safely */}
      {referral ? (
                <div className="referral-info mt-4">
                  <h3 className="text-lg font-semibold">Referral Information</h3>
                  <p>Referral Code: {referral.referral_code}</p>
                  <p>Referral Count: {referral.referral_count}</p>
                  <p>Rewards Claimed: {referral.rewards_claimed}</p>
                </div>
              ) : (
                <p>No referral information available.</p>
              )}

        {/* Displaying and Managing Roles */}
        <div className="roles-info mt-4">
          <h3 className="text-lg font-semibold">Roles</h3>
          {allRoles.map(role => (
            <label key={role.name} className="flex items-center space-x-3 space-y-4">
              <input
                type="checkbox"
                checked={isRoleSelected(role.name)}
                onChange={() => handleRoleChange(role)}
                className="checkbox"
              />
              <span className="label-text">{role.name}</span>
            </label>
          ))}
        </div>


      {/* Update Form */}
      <div className="form-control">
          <label className="label">
            <span className="label-text">New Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered"
            value={newEmail}
            onChange={handleEmailChange}
          />
          <button className="btn btn-primary mt-2" onClick={handleUpdate}>Update</button>
          {success && <p className="text-green-500 mt-2">{success}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    </div>
  </div>

    
  );
};



export default PlansCardAdmin;


