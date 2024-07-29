import React from "react";
import UserLayout from "../../components/Layout";
import SalesTrackerPageContent from "../../components/SalesTrackerPage";
import { EstimateProvider } from "../../../components/EstimateContext";
import "../../../../styles/sales-and-profits.css";
import MetadataHead from '@/app/components/MetadataHead';
import ThemeSetter from "@/app/components/ThemeSetter";

export const metadata = {
  title: 'Track Your Sales and Profits - Flippify',
  description: 'Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success.',
  openGraph: {
    title: 'Track Your Sales and Profits - Flippify',
    description: 'Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success.',
    url: 'https://flippify.co.uk/sales-tracker',
    images: [
      {
        url: 'https://i.imgur.com/sales-tracker.png',
        width: 1908,
        height: 1076,
        alt: 'Sales Tracker Page Image'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function SalesTracker() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="light" />
      <UserLayout>
        <EstimateProvider>
          <SalesTrackerPageContent />
        </EstimateProvider>
      </UserLayout>
    </>
  );
}
