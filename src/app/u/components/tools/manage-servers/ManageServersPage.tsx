"use client";

import React, { useState } from "react";
import Link from "next/link";

import ManagerServersSelectionList from "./SelectionList";
import ManageServersBotsCustom from "./BotsCustom";
import ManageServersMetrics from "./Metrics";
import ManageServersStatus from "./Status";
import ManageServersDocs from "./Docs";
import ManageServersApi from "./Api";

import DisabledLink from "./DisabledLink";


const ManagerServersPage = () => {
	const [activeComponent, setActiveComponent] = useState<string>("Monitors");

	const renderComponent = () => {
		switch (activeComponent) {
			case "Monitors":
				return <ManageServersBotsCustom />;
			case "Metrics":
				return <ManageServersMetrics />;
			case "Documentation":
				return <ManageServersDocs />;
			case "API":
				return <ManageServersApi />;
			case "Status":
				return <ManageServersStatus />;
			default:
				return <ManagerServersSelectionList />;
		}
	};

	const tabClass = "row-span-5 md:col-span-2 text-center text-black hover:text-gray-400 transition duration-200"

	return (
		<div className="w-full h-screen flex flex-col justify-start">
			<div className="w-full p-4 bg-white shadow rounded-l">
				<div className="container flex justify-center">
					{/* Navbar Items */}
					<div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-10 w-full">
						<Link
							href="#monitors"
							className={`${tabClass} ${activeComponent === "Monitors" ? "font-bold" : ""}`}
							onClick={() => setActiveComponent("Monitors")}
						>
							Monitors
						</Link>
						<DisabledLink
							href="#metrics"
							text="Metrics"
							isDisabled={true}
							tooltip="In Development"
							activeComponent={activeComponent}
							setActiveComponent={setActiveComponent} />
						<DisabledLink
							href="#documentation"
							text="Documentation"
							isDisabled={true}
							tooltip="In Development"
							activeComponent={activeComponent}
							setActiveComponent={setActiveComponent} />
						<DisabledLink
							href="#api"
							text="API"
							isDisabled={true}
							tooltip="In Development"
							activeComponent={activeComponent}
							setActiveComponent={setActiveComponent} />
						<DisabledLink
							href="#status"
							text="Status"
							isDisabled={true}
							tooltip="In Development"
							activeComponent={activeComponent}
							setActiveComponent={setActiveComponent} />
					</div>
				</div>
				{/* Render the selected component */}
				<div className="pt-4">
					{renderComponent()}
				</div>
			</div>


		</div>
	);
};

export default ManagerServersPage;
