"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { auth, firestore } from "@/lib/firebase/config";
import { signInWithEmailAndPassword as firebaseSignIn } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { IUser } from "@/models/user";
import { Lato } from 'next/font/google';
import Image from "next/image";
import { StatusType } from "@/models/config";
import UnderMaintenance from "../development/UnderMaintenance";
import { retrieveStatus } from "@/services/api/request";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { validateEmailInput } from "@/utils/input-validation";
import { usersCol } from "@/services/firebase/constants";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });


const LoginContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<StatusType | null>(null);
    const router = useRouter();

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
                await firebaseSignIn(auth, email, password);
                const userRef = doc(firestore, usersCol, auth.currentUser?.uid ?? "");
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data() as IUser;
                router.push(`/u/${userData.username}/dashboard`);
            }
        } catch (e) {
            console.error("Login error:", e);
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email && password) {
            handleLogin();
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
        <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center p-4 lg:-mt-12 2xl:-mt-24 gap-16">
            {(status === "active" || status === null) && (
                <>
                    <div className="bg-white rounded-3xl shadow-lg w-full max-w-xl lg:max-w-md p-8">
                        {/* Logo */}
                        <h2 className={`${lato.className} pb-1 text-[40px] flex justify-center font-bold mb-4 text-black`}>
                            flippify
                        </h2>

                        {/* Title & Subtitle */}
                        <h2 className="text-2xl font-semibold text-center mb-2">
                            Welcome back
                        </h2>
                        <p className="text-center text-gray-500 mb-6">
                            Please enter your details to sign in.
                        </p>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                className="input input-bordered w-full bg-white placeholder-gray-400"
                            />
                            <div className="relative">
                                <input
                                    type={hidePassword ? 'password' : 'text'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                            )}
                            <div className="flex flex-row gap-1 mt-5 justify-center">
                                <button
                                    type="button"
                                    onClick={() => router.push("/l/reset-password")}
                                    className="text-houseBlue hover:underline text-sm"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !status || !validateEmailInput(email) || !password}
                                className="select-none disabled:bg-muted/50 disabled:text-gray-500 w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
                            >
                                {loading ?
                                    <div className="relative flex justify-center items-center">
                                        <span>Processing...</span>
                                        <span className="absolute right-1"><LoadingSpinner /></span>
                                    </div> :
                                    status ? "Login" :
                                        <div className="w-full flex justify-center">
                                            Please wait...
                                        </div>
                                }
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="flex flex-row gap-1 mt-5 justify-center">
                            <p>Don&apos;t have an account?</p>
                            <button
                                onClick={() => router.push("/l/sign-up")}
                                className="text-houseBlue hover:underline"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                    <div>
                        <Image
                            src="/auth/login.svg"
                            alt="Sign Up Image"
                            className="object-cover hidden lg:block"
                            width={600}
                            height={600}
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

export default LoginContent
