import React from "react";
import Layout from "../../components/layout/Layout";
import ThemeSetter from "@/src/app/components/ThemeSetter";
import ProfileContent from "../../components/home/profile/ProfilePage";

export const metadata = {
	title: 'Manage Profile - Flippify',
	description: 'Manage your Flippify profile. Customize your experience and optimize your reselling activities.',
};

const Profile = () => {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['']}>
				<ProfileContent />
			</Layout>
		</>
	);
};

export default Profile;
