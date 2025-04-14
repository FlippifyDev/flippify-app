"use client";

import React from 'react';
import Head from 'next/head';

interface MetadataProps {
	title: string;
	description: string;
	openGraph?: {
		title: string;
		description: string;
		url: string;
		images: { url: string; width: number; height: number; alt: string }[];
	};
	robots: {
		index: boolean;
		follow: boolean;
		nocache: boolean;
		googleBot: {
			index: boolean;
			follow: boolean;
			noimageindex: boolean;
			'max-video-preview': number;
			'max-image-preview': string;
			'max-snippet': number;
		};
	};
}

const MetadataHead: React.FC<MetadataProps> = ({ title, description, openGraph, robots }) => {
    const robotsContent = [
        robots.index ? "index" : "noindex",
        robots.follow ? "follow" : "nofollow",
        robots.nocache ? "noarchive" : null,
    ].filter(Boolean).join(", ");

    const googleBotContent = [
        robots.googleBot.index ? "index" : "noindex",
        robots.googleBot.follow ? "follow" : "nofollow",
        robots.googleBot.noimageindex ? "noimageindex" : null,
        robots.googleBot["max-video-preview"] !== undefined ? `max-video-preview:${robots.googleBot["max-video-preview"]}` : null,
        robots.googleBot["max-image-preview"] ? `max-image-preview:${robots.googleBot["max-image-preview"]}` : null,
        robots.googleBot["max-snippet"] !== undefined ? `max-snippet:${robots.googleBot["max-snippet"]}` : null,
    ].filter(Boolean).join(", ");


	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={openGraph?.title} />
			<meta property="og:description" content={openGraph?.description} />
			<meta property="og:url" content={openGraph?.url} />
			<meta property="og:image" content={openGraph?.images[0].url} />
            <meta name="robots" content={robotsContent} />
            <meta name="googlebot" content={googleBotContent} />
		</Head>
	);
};

export default MetadataHead;
