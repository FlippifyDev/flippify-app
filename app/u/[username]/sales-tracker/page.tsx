"use client";

import React from "react";
import UserLayout from "../../components/Layout";
import SalesTrackerPageContent from "../../components/SalesTrackerPage";
import { EstimateProvider } from "../../../components/EstimateContext";
import "../../../../styles/sales-and-profits.css";
import Head from "next/head";
import ThemeSetter from "@/app/components/ThemeSetter";

export default function SalesTracker() {
  return (
    <>
      <Head>
        <title>Track Your Sales and Profits - Flippify</title>
        <meta name="description" content="Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success." />
        <meta property="og:title" content="Track Your Sales and Profits - Flippify" />
        <meta property="og:description" content="Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success." />
        <meta property="og:url" content="https://flippify.co.uk/sales-tracker" />
        <meta property="og:image" content="https://i.imgur.com/sales-tracker.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="light" />
      <UserLayout>
        <EstimateProvider>
          <SalesTrackerPageContent />
        </EstimateProvider>
      </UserLayout>
    </>
  );
}
