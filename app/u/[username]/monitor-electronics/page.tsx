import ElectronicsPage from '../../components/monitor-electronics/ElectronicsPage'
import ThemeSetter from "@/app/components/ThemeSetter";
import Layout from "../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout anySubscriptions={["standard", "electronics", "admin"]}>
        <ElectronicsPage />
      </Layout>
    </>
  )
}