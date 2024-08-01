import React from "react";
import UserLayout from "../../components/Layout";
import ThemeSetter from "@/app/components/ThemeSetter";
import ProfileContent from "../../components/ProfileContent";

export const metadata = {
  title: 'Manage Profile - Flippify',
  description: 'Manage your Flippify profile. Customize your experience and optimize your reselling activities.',
};

const Profile = () => {
  return (
    <>
      <ThemeSetter theme="light" />
      <UserLayout>
        <ProfileContent />
      </UserLayout>
    </>
  );
};

export default Profile;
