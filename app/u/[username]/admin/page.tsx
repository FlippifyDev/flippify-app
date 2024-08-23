'use client';

import { useEffect, useState } from 'react';
import { IUser } from 'app/api/auth-mongodb/userModel';
import Card from 'app/u/components/PlansCardAdmin';
import Layout from '../../components/Layout';

// Since Role and Referral are based on ISubscription and IReferral respectively:
type Role = IUser['subscriptions'][0];
type Referral = IUser['referral'];

export default function Admin() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log('Fetched users:', data); // Debug log
        setUsers(data.users || []); // Default to empty array if `data.users` is undefined
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      }
    }

    fetchUsers();
  }, []);

  return (
    <Layout>
    <div style={styles.grid}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.length > 0 ? (
        users.map((user) => (
          <Card
            key={user.discord_id.toString()}
            username={user.username}
            email={user.email}
            stripeCustomerId={user.stripe_customer_id}
            discord_id={parseInt(user.discord_id.toString(), 10)} // Convert to number
            _id={user._id.toString()} // Ensure this is a string
            referral={user.referral!}
            
            subscriptions={user.subscriptions.map((sub) => ({
              ...sub,
              role_id: sub.role_id ? sub.role_id.toString() : '', // Fallback to an empty string if role_id is undefined
              
            }))}
          />
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
     </Layout>
  );
}

const styles = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  } as React.CSSProperties,
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
};
