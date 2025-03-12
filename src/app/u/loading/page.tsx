"use client";

// Local Imports
import Layout from "../components/layout/Layout";
import ThemeSetter from "@/src/app/components/ThemeSetter";
import SignOutButton from "../../components/SignOutButton";
import LayoutLoadingSkeleton from "../components/layout/LayoutLoadingSkeleton";
import LayoutProductsSkeleton from "../components/layout/LayoutProductsSkeleton";

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
        <Layout>
            <SignOutButton />
        </Layout>
	);
}