import React from "react";
import Layout from "../../components/layout/Layout";
import SalesTrackerPageContent from "../../components/tools/sales-tracker/SalesTrackerPage";
import { EstimateProvider } from "../../../components/EstimateContext";
import "../../../../styles/sales-and-profits.css";
import ThemeSetter from "@/app/components/ThemeSetter";

export const metadata = {
  title: 'Sales & Profits - Flippify',
  description: 'Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success.',
};

export default function SalesTracker() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout anySubscriptions={['standard', 'admin']}>
        <EstimateProvider>
          <SalesTrackerPageContent />
        </EstimateProvider>
      </Layout>
    </>
  );
}
