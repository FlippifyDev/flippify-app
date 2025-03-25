"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { auth } from "@/lib/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import { Suspense } from "react";
import Image from "next/image";

const googleProvider = new GoogleAuthProvider();

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
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
                router.push("/auth/redirect");
            }
        } catch (e) {
            console.error("Login error:", e);
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const signInResult = await signIn("credentials", {
                idToken,
                redirect: false,
            });
            if (signInResult?.error) {
                setErrorMessage("Authentication failed. Please try again.");
            } else {
                router.push("/auth/redirect");
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            setErrorMessage("Google sign-in failed. Please try again.");
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

    return (
        <>
            <ThemeSetter theme="dark" />
            <Suspense fallback={<Loading />}>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center mt-[-64px] p-4">
                        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
                            {/* Logo */}
                            <div className="flex justify-center mb-6">
                                <Image
                                    src="/FlippifyLogoLongBlack.png"
                                    alt="Logo"
                                    className="w-1/3 h-1/3"
                                />
                            </div>

                            {/* Title & Subtitle */}
                            <h2 className="text-2xl font-semibold text-center mb-2">
                                Welcome back
                            </h2>
                            <p className="text-center text-gray-500 mb-6">
                                Please enter your details to sign in.
                            </p>

                            {/* Social Login Buttons */}
                            <div className="flex justify-center mb-6">
                                <button
                                    className="border rounded-lg w-full py-[10px] flex justify-center items-center gap-2 hover:bg-gray-50"
                                    onClick={handleGoogleSignIn}
                                >
                                    <Image
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

                            {/* Email/Password Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                    className="w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
                                >
                                    {loading ? "Processing..." : "Login"}
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
                    </div>
                </Layout>
            </Suspense>
        </>
    );
};

export default Login;