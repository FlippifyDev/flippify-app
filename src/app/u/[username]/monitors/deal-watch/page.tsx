import DealWatchPage from '../../../components/monitors/DealWatch'
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout anySubscriptions={["member", "deal watch", "admin"]}>
				<DealWatchPage />
			</Layout>
		</>
	)
}