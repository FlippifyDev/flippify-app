import ResellerNewsPage from '../../components/home/reseller-news/ResellerNewsPage'
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../components/layout/Layout";

import React from 'react'

export default function ResellerNews() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={["admin"]}>
				<ResellerNewsPage />
			</Layout>
		</>
	)
}