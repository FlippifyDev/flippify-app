"use client";

import { auth, firestore } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        // Sign in with credentials (using NextAuth)
        const result = await signIn("credentials", {
          email: emailRef.current,
          password: passwordRef.current,
          redirect: false,
        });
        if (result?.error) {
          console.error("Error during sign-in:", result.error);
          return;
        }
        // Update Firestore user document with username and subscription info
        await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
          username: usernameRef.current,
          subscriptions: [
            {
              name: "accessGranted",
              roleId: "0",
              override: true,
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
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      usernameRef.current = username;
      emailRef.current = email;
      passwordRef.current = password;
      await sendEmailVerification(user);
      setEmailVerifying(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {!emailVerifying ? (
        <SignUpForm
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
      ) : emailVerified ? (
        <EmailVerified />
      ) : (
        <EmailVerifying />
      )}
    </div>
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
  router: any;
  loading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  username,
  email,
  password,
  setUsername,
  setEmail,
  setPassword,
  handleSignUp,
  router,
  loading,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/FlippifyLogoLongBlack.png" alt="Logo" className="w-1/3 h-1/3" />
      </div>
      {/* Title & Subtitle */}
      <h1 className="text-2xl font-semibold text-center mb-2">Create your account</h1>
      <p className="text-center text-gray-500 mb-6">
        Sign up to get started.
      </p>
      {/* Social Login Buttons */}
      <div className="flex space-x-4 justify-center mb-6">
        <button
          className="border rounded-lg px-[40px] sm:px-[60px] py-[10px] flex items-center gap-2 hover:bg-gray-50"
          onClick={() =>
            alert("Google sign-up not implemented via popup. Please use email sign up.")
          }
        >
          <img src="/GoogleLogo.png" alt="Google Logo" className="w-6 h-6" />
        </button>
        <button
          className="border rounded-lg px-[40px] sm:px-[60px] py-[10px] flex items-center gap-2 hover:bg-gray-50"
          onClick={() =>
            alert("Twitter sign-up not implemented via popup. Please use email sign up.")
          }
        >
          <img src="/XLogo.png" alt="Twitter Logo" className="w-6 h-6" />
        </button>
      </div>
      {/* OR Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-400">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      {/* Input Fields */}
      <div className="space-y-4">
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
      </div>
      <button
        onClick={handleSignUp}
        className="w-full mt-4 p-3 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 rounded-lg shadow-lg"
      >
        {loading ? "Processing..." : "Sign Up"}
      </button>
      {/* Login Link */}
      <div className="flex flex-row gap-1 mt-5 justify-center">
        <p>Already have an account?</p>
        <button
          onClick={() => router.push("/login")}
          className="text-houseBlue hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
