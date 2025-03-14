"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";

import { auth, firestore } from "@/lib/firebase/config";
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignIn,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { IUser } from "@/models/user";
import { signIn } from "next-auth/react";

// Create provider instances for Google and Twitter
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // -- Email/Password Login
  const handleLogin = async () => {
    try {
      setLoading(true);
      // Attempt Next-Auth credentials login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage("Invalid email or password");
      } else {
        // Also sign in with Firebase Auth
        await firebaseSignIn(auth, email, password);
        // Fetch user document from Firestore
        const userRef = doc(firestore, "users", auth.currentUser?.uid ?? "");
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as IUser;
        // Redirect on successful sign-in
        router.push(`/u/${userData.username}/dashboard`);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  // -- Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google user:", user);
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as IUser;
        router.push(`/u/${userData.username}/dashboard`);
      } else {
        router.push("/u/new-user-setup");
      }
    } catch (e) {
      console.error("Google login error:", e);
      setErrorMessage("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -- Twitter Login
  const handleTwitterLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      console.log("Twitter user:", user);
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as IUser;
        router.push(`/u/${userData.username}/dashboard`);
      } else {
        router.push("/u/new-user-setup");
      }
    } catch (e) {
      console.error("Twitter login error:", e);
      setErrorMessage("Twitter login failed. Please try again.");
    } finally {
      setLoading(false);
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
                <img
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
              <div className="flex space-x-4 justify-center mb-6">
                {/* Google Login */}
                <button
                  className="border rounded-lg px-[40px] sm:px-[60px] py-[10px] flex items-center gap-2 hover:bg-gray-50"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="/GoogleLogo.png"
                    alt="Google Logo"
                    className="w-6 h-6"
                  />
                </button>

                {/* Twitter Login */}
                <button
                  className="border rounded-lg px-[40px] sm:px-[60px] py-[10px] flex items-center gap-2 hover:bg-gray-50"
                  onClick={handleTwitterLogin}
                >
                  <img
                    src="/XLogo.png"
                    alt="Twitter Logo"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              {/* OR Divider */}
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-400">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Email/Password Inputs */}
              <div className="space-y-4">
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
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              <button
                onClick={handleLogin}
                className="w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
              >
                {loading ? "Processing..." : "Login"}
              </button>

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
