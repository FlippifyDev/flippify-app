import SneakerReleaseInfoPage from '../../../components/monitors/SneakerReleaseInfo'
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout anySubscriptions={["member", "admin"]} pagePath='monitor'>
				<SneakerReleaseInfoPage />
			</Layout>
		</>
	)
}