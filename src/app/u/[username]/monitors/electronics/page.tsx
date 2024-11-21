import PageElectronics from '../../../components/monitors/Electronics'
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function Electronics() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout anySubscriptions={["member", "electronics"]}>
				<PageElectronics />
			</Layout>
		</>
	)
}