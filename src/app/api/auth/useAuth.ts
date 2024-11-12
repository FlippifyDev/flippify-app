import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const useAuth = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				console.log('User is signed in:', user.uid);
			} else {
				setUser(null);
				console.log('No user is signed in');
			}
		});

		return () => unsubscribe();
	}, []);

	return user;
};

export default useAuth;
