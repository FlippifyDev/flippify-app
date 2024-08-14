

// components/Card.tsx
import React, {useState} from 'react';

interface CardProps {
  username: string;
  email: string;
  stripeCustomerId: string;
  discord_id: number;
  _id:string;
  // Add more props as needed
} // Use a default placeholder or hash if available

const PlansCardAdmin: React.FC<CardProps> = ({ username, email, stripeCustomerId, discord_id, _id}) => {
    const avatarUrl = `https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-wooh9l0j.png`;
    const [newEmail, setNewEmail] = useState(email);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
      };

      const handleUpdate = async () => {
        try {
          // Ensure discord_id is a string
          const payload = { _id: _id, email: newEmail };
          console.log('Sending payload:', payload);
    
          const res = await fetch('/api/users', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) {
            throw new Error('Failed to update email');
          }
    
          setSuccess('Email updated successfully');
          setError(null);
        } catch (error) {
          console.error('Error updating email:', error);
          setError('Failed to update email');
          setSuccess(null);
        }
      };
      
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


