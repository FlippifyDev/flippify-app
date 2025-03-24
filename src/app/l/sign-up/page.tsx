"use client";

import { auth, firestore } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import { retrieveAuthenticatedUserCount } from "@/services/firebase/retrieve-admin";

// Create provider instances for social sign-up
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

const SignUp = () => {
    const { data: session, update: setSession } = useSession();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userCount, setUserCount] = useState(0);

    const router = useRouter();

    // Refs to persist values for email verification polling
    const usernameRef = useRef<string | null>(null);
    const emailRef = useRef<string | null>(null);
    const passwordRef = useRef<string | null>(null);

    useEffect(() => {
        if (session) {
            router.push(`/u/${session.user.username}/dashboard`);
        }
    }, [session, router]);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const userCount = await retrieveAuthenticatedUserCount();
                setUserCount(userCount);
                console.log("Authenticated user count:", userCount);
            } catch (e: any) {
                console.error("Error fetching user count:", e);
            }
        };
        fetchUserCount();
    }, []);

    // Poll for email verification (for email/password sign‑up)
    useEffect(() => {
        const checkVerificationInterval = setInterval(async () => {
            if (!auth.currentUser) return;
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                setEmailVerified(true);
                // Sign in with NextAuth credentials
                const result = await signIn("credentials", {
                    email: emailRef.current,
                    password: passwordRef.current,
                    redirect: false,
                });
                if (result?.error) {
                    console.error("Error during sign-in:", result.error);
                    return;
                }
                // Update user document with username and subscription info
                await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
                    username: usernameRef.current,
                    subscriptions: [
                        {
                            name: "accessGranted",
                            id: "0",
                            override: true,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                });
                clearInterval(checkVerificationInterval);
                router.push(`/u/${usernameRef.current}/dashboard`);
            }
        }, 3000);
        return () => clearInterval(checkVerificationInterval);
    }, [router]);

    const handleSignUp = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            usernameRef.current = username;
            emailRef.current = email;
            passwordRef.current = password;
            await sendEmailVerification(user);
            setEmailVerifying(true);
        } catch (e: any) {
            console.error(e);
            setErrorMessage("Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleSignUp = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Check if username is set and not empty
                if (!userData.username || userData.username.trim() === "") {
                    router.push("/u/account-setup");
                } else {
                    router.push(`/u/${userData.username}/dashboard`);
                }
            } else {
                router.push("/u/account-setup");
            }
        } catch (e: any) {
            console.error("Google sign-up error:", e);
            setErrorMessage("Google sign-up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username && email && password) {
            handleSignUp();
        }
    };

    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center mt-[-64px]">
                        {!emailVerifying ? (
                            <SignUpForm
                                username={username}
                                email={email}
                                password={password}
                                setUsername={setUsername}
                                setEmail={setEmail}
                                setPassword={setPassword}
                                handleSignUp={handleSignUp}
                                handleSubmit={handleSubmit}
                                router={router}
                                loading={loading}
                                handleGoogleSignUp={handleGoogleSignUp}
                                errorMessage={errorMessage}
                                userCount={userCount}
                            />
                        ) : emailVerified ? (
                            <EmailVerified />
                        ) : (
                            <EmailVerifying />
                        )}
                    </div>
                </Layout>
            </Suspense>
        </>
    );
};

const EmailVerified = () => {
    return (
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 text-center">
            <h1 className="text-gray-900 text-2xl mb-5">Your email has been verified</h1>
            <p className="text-gray-600">We are preparing your account...</p>
        </div>
    );
};

const EmailVerifying = () => {
    return (
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 text-center">
            <h1 className="text-gray-900 text-2xl mb-5">Verifying Your Email</h1>
            <p className="text-gray-600">Please check your inbox to verify your email.</p>
        </div>
    );
};

interface SignUpFormProps {
    username: string;
    email: string;
    password: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleSignUp: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    router: any;
    loading: boolean;
    handleGoogleSignUp: () => void;
    errorMessage: string;
    userCount: number;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
    username,
    email,
    password,
    setUsername,
    setEmail,
    setPassword,
    handleSignUp,
    handleSubmit,
    router,
    loading,
    handleGoogleSignUp,
    errorMessage,
    userCount
}) => {
    const maxUserCount = 100;
    return (
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <img src="/FlippifyLogoLongBlack.png" alt="Logo" className="w-1/3 h-1/3" />
            </div>
            <div className="flex flex-col mb-1">
                <span className="w-full text-center">{userCount === maxUserCount ? "All spots have been taken!": "Spots remaining"}</span>
                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-11 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 flex flex-row items-center">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((userCount * 100) / maxUserCount).toFixed(0)}%` }}></div>
                        <span className={`ml-1 ${(userCount === maxUserCount) || (userCount === 0) ? 'hidden' : 'block'}`}>{userCount}</span>
                    </div>
                    <span className='col-span-1 ml-1'>{maxUserCount}</span>
                </div>
            </div>
            {/* Title & Subtitle */}
            <h1 className="text-2xl font-semibold text-center mb-2">Create your account</h1>
            <p className="text-center text-gray-500 mb-6">Sign up to get started.</p>
            {/* Social Login Buttons */}
            <div className="flex justify-center mb-6">
                <button
                    className="border rounded-lg w-full py-[10px] flex justify-center items-center gap-2 hover:bg-gray-50"
                    onClick={handleGoogleSignUp}
                >
                    <img
                        src="/GoogleLogo.png"
                        alt="Google Logo"
                        className="w-6 h-6"
                    />
                    <span className="font-medium">Sign in with Google</span>
                </button>
            </div>
            {/* OR Divider */}
            <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-400">OR</span>
                <hr className="flex-grow border-gray-300" />
            </div>
            {/* Wrap Input Fields in a Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-xl outline-none placeholder-gray-400"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-xl outline-none placeholder-gray-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-xl outline-none placeholder-gray-400"
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    className={`${userCount === maxUserCount ? 'disabled cursor-not-allowed': ''} w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg`}
                >
                    {loading ? "Processing..." : "Sign Up"}
                </button>
            </form>
            {/* Login Link */}
            <div className="flex flex-row gap-1 mt-5 justify-center">
                <p>Already have an account?</p>
                <button
                    onClick={() => router.push("/l/login")}
                    className="text-houseBlue hover:underline"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default SignUp;
