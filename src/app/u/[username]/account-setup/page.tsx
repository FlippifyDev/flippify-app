"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import Layout from "../../components/layout/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import Loading from "@/app/components/Loading";
import { Suspense } from "react";

const AccountSetup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (
      session &&
      session.user &&
      session.user.username &&
      session.user.authentication?.usernameVerified
    ) {
      router.push(`/u/${session.user.username}/dashboard`);
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setErrorMessage("Please enter a valid username.");
      return;
    }
    setLoading(true);
    try {
      if (!session || !session.user || !session.user.id) {
        setErrorMessage("Session expired. Please log in again.");
        router.push("/l/login");
        return;
      }
      const userRef = doc(firestore, "users", session.user.id);
      await updateDoc(userRef, {
        username: trimmedUsername,
        "authentication.usernameVerified": true,
      });
      router.push(`/u/${trimmedUsername}/dashboard`);
    } catch (error) {
      console.error("Error updating username:", error);
      setErrorMessage("Failed to update username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    router.push("/l/login");
    return null;
  }

  return (
    <>
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
              <h1 className="text-2xl font-semibold text-center mb-4">
                Set Up Your Account
              </h1>
              <p className="text-center text-gray-500 mb-6">
                Please choose a username to complete your account setup.
              </p>
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full p-3 bg-gray-100 rounded-xl outline-none placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
                >
                  {loading ? "Processing..." : "Save Username"}
                </button>
              </form>
            </div>
          </div>
        </Layout>
      </Suspense>
    </>
  );
};

export default AccountSetup;