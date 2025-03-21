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
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignIn,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { IUser } from "@/models/user";
import { signIn } from "next-auth/react";

const googleProvider = new GoogleAuthProvider();

const generateRandomUsername = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

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
        await firebaseSignIn(auth, email, password);
        const userRef = doc(firestore, "users", auth.currentUser?.uid ?? "");
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as IUser;
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

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      await signIn("google", { callbackUrl: "/u/account-setup" });
    } catch (e: any) {
      console.error("Google sign-in error:", e);
      setErrorMessage("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  // This function will be triggered when the user presses Enter in the form.
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
