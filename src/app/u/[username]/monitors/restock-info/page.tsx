import RestockInfoPage from '../../../components/monitors/RestockInfo'
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function RestockInfo() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout anySubscriptions={["member", "restock info"]}>
				<RestockInfoPage />
			</Layout>
		</>
	)
}