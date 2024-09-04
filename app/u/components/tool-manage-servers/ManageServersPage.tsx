"use client";
import React, { useState } from "react";
import ManagerServersSelectionList from "./ManageServersSelectionList";
import Docu from "./ManageServersDocs";
import Api from "./ManageServersApi";
import StatusF from "./ManageServersStatus";
import Metrik from "./ManageServersMetrics";
import Cust from "./ManageServersCust";


const BotCustomizations = () => <Cust />;
const Metrics = () => <Metrik />;
const Documentation = () => <Docu />;
const API = () => <Api />;
const Status = () => <StatusF />;

const ManagerServersPage = () => {
  const [activeComponent, setActiveComponent] = useState<string>("BotCustomizations");

  const renderComponent = () => {
    switch (activeComponent) {
      case "BotCustomizations":
        return <BotCustomizations />;
      case "Metrics":
        return <Metrics />;
      case "Documentation":
        return <Documentation />;
      case "API":
        return <API />;
      case "Status":
        return <Status />;
      default:
        return <ManagerServersSelectionList />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-start mt-5">
      <nav className="w-full p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          {/* Navbar Items */}
          <div className="flex space-x-4 justify-center flex-grow">
            <a
              href="#randomshits"
              className={`text-black hover:text-gray-300 ${activeComponent === "BotCustomizations" ? "font-bold" : ""}`}
              onClick={() => setActiveComponent("BotCustomizations")}
            >
              Bot Customizations
            </a>
            <a
              href="#numbershit"
              className={`text-black hover:text-gray-300 ${activeComponent === "Metrics" ? "font-bold" : ""}`}
              onClick={() => setActiveComponent("Metrics")}
            >
              Metrics
            </a>
            <a
              href="#nerdystuff"
              className={`text-black hover:text-gray-300 ${activeComponent === "Documentation" ? "font-bold" : ""}`}
              onClick={() => setActiveComponent("Documentation")}
            >
              Documentation
            </a>
            <a
              href="#ultra-nerdy-stuff"
              className={`text-black hover:text-gray-300 ${activeComponent === "API" ? "font-bold" : ""}`}
              onClick={() => setActiveComponent("API")}
            >
              API
            </a>
            <a
              href="#status-for-when-we-fuck-up"
              className={`text-black hover:text-gray-300 ${activeComponent === "Status" ? "font-bold" : ""}`}
              onClick={() => setActiveComponent("Status")}
            >
              Status
            </a>
          </div>
        </div>
      </nav>

      {/* Render the selected component */}
      <div className="p-4 flex-grow">
        {renderComponent()}
      </div>
    </div>
  );
};

export default ManagerServersPage;
