import RetiringSetsPage from '../../../components/monitors/retiring-sets/RetiringSetsPage'
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout anySubscriptions={["standard", "retiring sets", "admin"]} pagePath='monitor'>
				<RetiringSetsPage />
			</Layout>
		</>
	)
}