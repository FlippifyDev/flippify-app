"use client";

// Local Imports
import { auth, firestore } from '@/lib/firebase/config';

// External Imports
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { doc, updateDoc } from 'firebase/firestore';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


const SignUp = () => {
    const { data: session } = useSession();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Persist email and password using useRef=
    const usernameRef = useRef<string | null>(null);
    const emailRef = useRef<string | null>(null);
    const passwordRef = useRef<string | null>(null);

    useEffect(() => {
        if (session) {
            router.push(`/u/${session.user.username}/dashboard`);
        }
    }, [session, router]);

    useEffect(() => {
        const checkVerificationInterval = setInterval(async () => {
            if (!auth.currentUser) return;

            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                setEmailVerified(true);
                const result = await signIn('credentials', {
                    email: emailRef.current,
                    password: passwordRef.current,
                    redirect: false,
                });

                if (result?.error) {
                    console.error('Error during sign-in:', result.error);
                    return;
                }
                await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
                    username: usernameRef.current,
                    subscriptions: [
                        {
                            name: "accessGranted",
                            roleId: "0",
                            override: true
                        }
                    ]
                });

                clearInterval(checkVerificationInterval);
                router.push(`/u/${usernameRef.current}/dashboard`);
            }
        }, 3000);
    }, [router]);

    const handleSignUp = async () => {
        try {
            setLoading(true);
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            usernameRef.current = username;
            emailRef.current = email;
            passwordRef.current = password;
            
            await sendEmailVerification(user);
            setEmailVerifying(true);
            setLoading(false);

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            {!emailVerifying ? (
                <SigningUp
                    username={username}
                    email={email}
                    password={password}
                    setUsername={setUsername}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleSignUp={handleSignUp}
                    router={router}
                    loading={loading}
                />
            ) : (
                emailVerified ? (
                    <EmailVerified />
                ) : (
                    <EmailVerifying />
                )
            )}
        </div>
    );
};


const EmailVerified = () => {
    return (
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 text-center">
            <h1 className="text-white text-2xl mb-5">Your email has been verified</h1>
            <p>We are preparing your account</p>
        </div>
    )
}


const EmailVerifying = () => {
    return (
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 text-center">
            <h1 className="text-white text-2xl mb-5">Verifying Your Email</h1>
            <p>Please go to your inbox to verify your email.</p>
        </div>
    )
}

interface SigningUpProps {
    username: string;
    email: string;
    password: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleSignUp: () => void;
    router: AppRouterInstance;
    loading: boolean;
}

const SigningUp: React.FC<SigningUpProps> = ({ username, email, password, setUsername, setEmail, setPassword, handleSignUp, router, loading }) => {
    return (
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
            <>
                <h1 className="text-white text-2xl mb-5">Sign Up</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSignUp}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    {loading ? "Processing..." : "Sign Up"}
                </button>
                <div className='flex flex-row gap-1 mt-3 justify-center'>
                    <p>Already have an account? </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-blue-400 hover:underline"
                    >
                        Login
                    </button>
                </div>

            </>
        </div>
    )
}


export default SignUp;
