import DealWatchPage from '../../../components/monitors/deal-watch/DealWatchPage'
import ThemeSetter from "@/app/components/ThemeSetter";
import Layout from "../../../components/layout/Layout";

import React from 'react'

export default function RetiringSets() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout requiredSubscriptions={["admin"]}>
        <DealWatchPage />
      </Layout>
    </>
  )
}