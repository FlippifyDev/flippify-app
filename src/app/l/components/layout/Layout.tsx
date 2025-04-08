"use client";

import React from "react";
import Navbar from "../dom/Navbar";
import LayoutGradientBackground from "./LayoutGradientBackground";
import LayoutWhiteSection from "./LayoutWhiteSection";
import Footer from "./Footer";

const Layout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
	return (
		<div className="relative min-h-screen bg-white flex flex-col">
			<div className="absolute top-0 left-0 w-full z-50">
				<Navbar />
			</div>

			<main className="relative flex-1 w-full overflow-hidden">
				<LayoutWhiteSection />
				<LayoutGradientBackground />
                <div className={`${className} relative flex justify-center z-10 mt-24 mb-24`}>
					{children}
				</div>
			</main>

			<footer className="relative h-full w-full flex justify-end">
				<Footer />
			</footer>
		</div>
	);
};

export default Layout;
