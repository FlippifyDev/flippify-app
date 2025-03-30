"use client"

// Local Imports
import { formatDateToISO } from "@/utils/format-dates";
import { auth, firestore } from "@/lib/firebase/config";
import { updateUserSubscriptionAdmin } from "@/services/firebase/update-admin";

// External Imports
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lato } from 'next/font/google';
import Image from "next/image";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const SignUpContent = () => {
    const { data: session } = useSession();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
                await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
                    username: usernameRef.current,
                    "authentication.onboarding": true,
                });
                await updateUserSubscriptionAdmin(auth.currentUser.uid, { name: "accessGranted", id: "0", override: true, createdAt: formatDateToISO(new Date()) });
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



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username && email && password) {
            handleSignUp();
        }
    };

    return (
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
                    errorMessage={errorMessage}
                />
            ) : emailVerified ? (
                <EmailVerified />
            ) : (
                <EmailVerifying />
            )}
        </div>
    )
}


const EmailVerified = () => {
    return (
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 text-center">
            <h2 className={`${lato.className} pb-1 text-[40px] flex justify-center font-bold mb-4 text-black`}>
                flippify
            </h2>
            <h1 className="text-gray-900 text-2xl mb-5">Your email has been verified</h1>
            <p className="text-gray-600">We are preparing your account...</p>
        </div>
    );
};

const EmailVerifying = () => {
    return (
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 text-center">
            <h2 className={`${lato.className} pb-1 text-[40px] flex justify-center font-bold mb-4 text-black`}>
                flippify
            </h2>
            <h1 className="text-gray-900 text-2xl mb-2">Verifying Your Email</h1>
            <p className="text-gray-600 mb-6">Please check your inbox to verify your email.</p>

            {/* Divider */}
            <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-400">OPEN</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            {/* Email Provider Buttons */}
            <div className="space-y-4">
                <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg w-full py-[10px] flex justify-center items-center gap-2 hover:bg-gray-50"
                >
                    <Image src="/GoogleLogo.png" alt="Gmail Logo" className="w-6 h-6" width={200} height={200} />
                    <span className="font-medium">Open Gmail</span>
                </a>
                <a
                    href="https://outlook.live.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg w-full py-[10px] flex justify-center items-center gap-2 hover:bg-gray-50"
                >
                    <Image src="/OutlookLogo.png" alt="Outlook Logo" className="w-6 h-6" width={200} height={200} />
                    <span className="font-medium">Open Outlook</span>
                </a>
                <a
                    href="https://www.icloud.com/mail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg w-full py-[10px] flex justify-center items-center gap-2 hover:bg-gray-50"
                >
                    <Image src="/iCloudLogo.png" alt="iCloud Logo" className="w-6 h-6" width={200} height={200} />
                    <span className="font-medium">Open iCloud Mail</span>
                </a>
                <a
                    href="https://mail.yahoo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg w-full py-[10px] flex justify-center items-center gap-2 hover:bg-gray-50"
                >
                    <Image src="/YahooLogo.png" alt="Yahoo Logo" className="w-6 h-6" width={200} height={200} />
                    <span className="font-medium">Open Yahoo Mail</span>
                </a>
            </div>
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
    errorMessage: string;
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
    errorMessage,
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
            {/* Logo */}
            <h2 className={`${lato.className} pb-1 text-[40px] flex justify-center font-bold mb-4 text-black`}>
                flippify
            </h2>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-semibold text-center mb-2">Create your account</h1>
            <p className="text-center text-gray-500 mb-6">Sign up to get started.</p>

            {/* Wrap Input Fields in a Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered w-full bg-white placeholder-gray-400"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full bg-white placeholder-gray-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full bg-white placeholder-gray-400"
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    className="w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
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

export default SignUpContent
