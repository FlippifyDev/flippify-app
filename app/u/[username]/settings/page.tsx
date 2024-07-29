import React from "react";
import Navbar from "../../components/Navbar";
import { Suspense } from "react";
import Loading from "../../../components/Loading";
import MetadataHead from "@/app/components/MetadataHead";
import ThemeSetter from "@/app/components/ThemeSetter";

export const metadata = {
  title: 'Settings - Flippify',
  description: 'Manage your Flippify settings and preferences. Customize your experience and optimize your reselling activities.',
  openGraph: {
    title: 'Settings - Flippify',
    description: 'Manage your Flippify settings and preferences. Customize your experience and optimize your reselling activities.',
    url: 'https://flippify.co.uk/settings',
    images: [
      {
        url: "https://i.imgur.com/2dItFcN.png",
        width: 1908,
        height: 1076,
        alt: "Settings Page Image"
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

const Settings = () => {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="light" />
      <Suspense fallback={<Loading />}>
        <div
          className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
          style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
        >
          <div className="flex flex-col min-h-screen">
            <div className="fixed top-0 left-0 right-0">
              <Navbar />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Settings;
