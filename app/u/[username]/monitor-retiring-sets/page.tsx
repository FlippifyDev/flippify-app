import RetiringSetsPage from '../../components/monitor-retiring-sets/RetiringSetsPage'
import ThemeSetter from "@/app/components/ThemeSetter";
import Layout from "../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout anySubscriptions={["standard", "retiring-sets", "admin"]}>
        <RetiringSetsPage />
      </Layout>
    </>
  )
}