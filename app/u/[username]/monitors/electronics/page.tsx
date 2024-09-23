import ElectronicsPage from '../../../components/monitors/electronics/ElectronicsPage'
import ThemeSetter from "@/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout anySubscriptions={["member", "electronics"]}>
        <ElectronicsPage />
      </Layout>
    </>
  )
}