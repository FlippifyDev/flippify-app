"use client";

import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Suspense } from "react";
import Loading from "../../../components/Loading";
import Head from "next/head";
import { generateMetadata } from "@/app/components/metadata";
import { pageMetadata } from "@/app/components/metadataConfig";

const metadata = generateMetadata(pageMetadata.settings);

const Settings = () => {
  useEffect(() => {
    // Set the theme to light mode for this page
    document.documentElement.setAttribute("data-theme", "light");
    // Cleanup function to reset theme when the component unmounts
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        {typeof metadata.robots === "string" ? (
          <meta name="robots" content={metadata.robots} />
        ) : (
          <>
            <meta name="robots" content="index, follow" />
            <meta
              name="googlebot"
              content="index, follow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
            />
          </>
        )}
      </Head>
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
