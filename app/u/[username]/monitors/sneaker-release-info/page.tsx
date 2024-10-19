import SneakerReleaseInfoPage from '../../../components/monitors/sneaker-release-info/SneakerReleaseInfoPage'
import ThemeSetter from "@/app/components/ThemeSetter";
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