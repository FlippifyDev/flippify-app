"use client"

// Local Imports
import { StatusType } from "@/models/config";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import UnderMaintenance from "../development/UnderMaintenance";
import { retrieveStatus } from "@/services/api/request";
import { auth, firestore } from "@/lib/firebase/config";
import { FaRegCheckCircle } from "react-icons/fa";
import { validateAlphaNumericInput, validateEmail, validateEmailInput, validatePasswordInput } from "@/utils/input-validation";

// External Imports
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lato } from 'next/font/google';
import dotenv from "dotenv";
import Image from "next/image";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { updateAccessGranted } from "@/services/firebase/admin-update";
import { usersCol } from "@/services/firebase/constants";
import { retrieveIdToken } from "@/services/firebase/retrieve";

dotenv.config();

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const SignUpContent = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [status, setStatus] = useState<StatusType | null>(null);

    const router = useRouter();

    // Refs to persist values for email verification polling
    const usernameRef = useRef<string | null>(null);
    const emailRef = useRef<string | null>(null);
    const passwordRef = useRef<string | null>(null);

    // Poll for email verification (for email/password sign‑up)
    useEffect(() => {
        const checkVerificationInterval = setInterval(async () => {
            try {
                if (!auth.currentUser) {
                    console.log("No current user found");
                    return;
                }

                // Store the current verification status before reload
                const wasVerifiedBefore = auth.currentUser.emailVerified;
                console.log("Before reload - Email verified status:", wasVerifiedBefore);

                // Reload the user properly with error handling
                try {
                    await auth.currentUser.reload();
                    console.log("User reloaded successfully");
                } catch (reloadError) {
                    console.error("Error reloading user:", reloadError);
                    return;
                }

                // Check the new verification status
                const isVerifiedNow = auth.currentUser.emailVerified;
                console.log("After reload - Email verified status:", isVerifiedNow);

                // Only proceed if the status changed from unverified to verified
                // This prevents the false positive issue you were experiencing
                if (!wasVerifiedBefore && isVerifiedNow) {
                    console.log("Email verification detected, proceeding with sign in");
                    setEmailVerified(true);

                    try {

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
                    } catch (error) {
                        console.error(error)
                    }

                    try {

                        await setDoc(doc(firestore, usersCol, auth.currentUser.uid), {
                            username: usernameRef.current,
                            authentication: {
                                onboarding: true,
                            }
                        }, { merge: true });
                    } catch (error) {
                        console.error(error)
                    }

                    try {
                        const idToken = await retrieveIdToken();
                        if (!idToken) return;
                        await updateAccessGranted({ idToken });
                    } catch (error) {
                        console.error(error)
                    }

                    clearInterval(checkVerificationInterval);
                    router.push(`/u/preparing?uid=${auth.currentUser.uid}&username=${usernameRef.current}`);
                }
            } catch (error) {
                console.error("Error in verification check:", error);
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


    useEffect(() => {
        async function fetchStatus() {
            const webStatus = await retrieveStatus();
            if (webStatus) {
                setStatus(webStatus["status"])
            }
        }

        fetchStatus()
    }, [])

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 -mt-24 gap-16">
            {(status === "active" || status === null) && (
                <>
                    {!emailVerifying ? (
                        <SignUpForm
                            username={username}
                            email={email}
                            password={password}
                            setUsername={setUsername}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleSubmit={handleSubmit}
                            router={router}
                            loading={loading}
                            status={status}
                            errorMessage={errorMessage}
                        />
                    ) : emailVerified ? (
                        <EmailVerified />
                    ) : (
                        <EmailVerifying />
                    )}
                    <div>
                        <Image
                            src="/auth/sign-up.svg"
                            alt="Sign Up Image"
                            className="object-cover hidden lg:block"
                            width={700}
                            height={700}
                        />
                    </div>
                </>
            )}

            {status === "under maintenance" && (
                <UnderMaintenance />
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
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    router: any;
    loading: boolean;
    status: StatusType | null;
    errorMessage: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
    username,
    email,
    password,
    setUsername,
    setEmail,
    setPassword,
    handleSubmit,
    router,
    loading,
    status,
    errorMessage,
}) => {
    const [hasEightCharacters, setHasEightCharacters] = useState(false);
    const [hasOneNumber, setHasOneNumber] = useState(false);
    const [hasOneSpecial, setHasOneSpecial] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    const [hidePassword, setHidePassword] = useState(true);

    function handlePasswordInput(value: string) {
        validatePasswordInput(value, setPassword)
        // At least 8 characters
        setHasEightCharacters(value.length >= 8);

        // At least one digit
        setHasOneNumber(/\d/.test(value));

        // At least one special character (adjust the class as you like)
        setHasOneSpecial(/[!@#$%^&*()_+=]/.test(value));
    }

    function handleEmailInput(value: string) {
        if (validateEmailInput(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        validateEmail(value, setEmail);
    }



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
                    onChange={(e) => validateAlphaNumericInput(e.target.value, setUsername)}
                    className="input input-bordered w-full bg-white placeholder-gray-400"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => handleEmailInput(e.target.value)}
                    className="input input-bordered w-full bg-white placeholder-gray-400"
                />
                <div className="relative">
                    <input
                        type={hidePassword ? 'password' : 'text'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handlePasswordInput(e.target.value)}
                        className="input input-bordered w-full bg-white placeholder-gray-400"
                        aria-required="false"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-muted/80 text-lg" onClick={() => setHidePassword(!hidePassword)}>
                        {hidePassword ? (
                            <IoMdEye />
                        ) : (
                            <IoMdEyeOff />
                        )}
                    </div>
                </div>
                <div className="w-full px-1">
                    {/* Length Check */}
                    <div className={`flex justify-between items-center text-sm ${hasEightCharacters ? "text-houseBlue" : "text-gray-400"}`}>
                        <span><FaRegCheckCircle /></span>
                        <span>Must contain at least 8 characters</span>
                    </div>
                    {/* Number Check */}
                    <div className={`flex justify-between items-center text-sm ${hasOneNumber ? "text-houseBlue" : "text-gray-400"}`}>
                        <span><FaRegCheckCircle /></span>
                        <span>Must contain at least 1 number</span>
                    </div>
                    {/* Special Character Check */}
                    <div className={`flex justify-between items-center text-sm ${hasOneSpecial ? "text-houseBlue" : "text-gray-400"}`}>
                        <span><FaRegCheckCircle /></span>
                        <span>Must contain at least 1 special character</span>
                    </div>
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || !status || !hasEightCharacters || !hasOneNumber || !hasOneSpecial || !validEmail || !username}
                    className="w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white disabled:bg-muted/50 disabled:text-gray-500 transition duration-300 rounded-lg shadow-lg"
                >
                    {loading ?
                        <div className="relative flex justify-center items-center">
                            <span>Processing...</span>
                            <span className="absolute right-1"><LoadingSpinner /></span>
                        </div> : status ? "Sign Up" :
                            <div className="w-full flex justify-center">
                                Please wait...
                            </div>
                    }
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
