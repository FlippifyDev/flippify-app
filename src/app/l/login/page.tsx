'use client'

import { auth, firestore } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { doc, getDoc } from 'firebase/firestore';
import { IUser } from '@/models/user';
import { Suspense } from 'react';
import Layout from '../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import Loading from '@/app/components/Loading';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                setErrorMessage("Invalid email or password");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                setLoading(false);
                const userRef = doc(firestore, "users", auth.currentUser?.uid ?? "");
                const userDoc = await getDoc(userRef);
                const user = userDoc.data() as IUser;
                router.push(`/u/${user.username}/dashboard`); // Redirect user on successful sign-in
            }
            setLoading(false);
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <>
			<ThemeSetter theme="dark" />
			<Suspense fallback={<Loading />}>
				<Layout>
                    <div className="min-h-screen flex justify-center pt-[180px]">
                        <div className="p-10 rounded-lg w-96">
                            <h1 className="text-white text-2xl mb-5 flex justify-center font-semibold">Login</h1>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 mb-4 bg-gray-200 rounded-xl outline-none text-white placeholder-gray-500"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 mb-4 bg-gray-200 rounded-xl outline-none text-white placeholder-gray-500"
                            />
                            <span className="text-red-500 text-sm">{errorMessage}</span>
                            <button
                                onClick={handleLogin}
                                className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                            >
                                {loading ? "Processing...": "Login"}
                            </button>
                            <div className='flex flex-row gap-1 mt-3 justify-center'>
                                <p>Don&apos;t have an account? </p>
                                <button
                                    onClick={() => router.push('/l/sign-up')}
                                    className="text-blue-400 hover:underline"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </Layout>
            </Suspense>
        </>
    );
};

export default Login;