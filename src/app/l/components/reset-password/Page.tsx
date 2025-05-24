"use client";

import { resetPassword } from '@/services/firebase/reset';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const { success, message } = await resetPassword(email);

        if (success) {
            setStatus('success');
            setMessage(message);
        } else {
            setStatus('error');
            setMessage(message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 -mt-24 gap-16">
            <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="input input-bordered w-full bg-white placeholder-gray-400"
                    />
                    {status !== 'idle' && (
                        <p className={`text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="select-none w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
                    >
                        Send Reset Link
                    </button>
                </form>
                <div className="flex flex-row gap-1 mt-5 justify-center">
                    <p>Know your password?</p>
                    <button
                        onClick={() => router.push("/l/login")}
                        className="text-houseBlue hover:underline"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Page
