"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/components/Loading";

const AuthRedirectClient = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session && session.user) {
      const { username, authentication } = session.user;
      if (authentication?.usernameVerified) {
        router.push(`/u/${username}/dashboard`);
      } else {
        router.push(`/u/${username}/account-setup`);
      }
    } else {
      router.push("/l/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  return null;
};

export default AuthRedirectClient;