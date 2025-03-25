"use client";

// Local Imports
import { SignOutLink } from "../../components/SignOutButton";
import LoadingAnimation from "../components/dom/ui/LoadingAnimation";

// External Imports
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    if (session && session.user) {
        router.push(`/u/${session.user.username}/dashboard`);
    }

    return (
        <div className="w-full h-screen bg flex flex-col justify-center items-center">
            <div className="">
                <LoadingAnimation text="" type="stack-loader" />
            </div>
            <div className="mt-4">
                <SignOutLink />
            </div>
        </div>
    );
}