import DashboardNoSubscriptionButton from "./DashboardNoSubscriptionButton";

import { IoMdCheckboxOutline } from "react-icons/io";
import { Lato } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });




interface DashboardNoSubscriptionProps {
    username: string
}


const DashboardNoSubscription: React.FC<DashboardNoSubscriptionProps> = ({ username }) => {
    return (
        <div className="flex justify-center items-center">
        <div className="card bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 w-96 h-auto">
            <div className="relative">
            <div className="absolute top-1 left-1 bg-houseBlue text-white rounded-full px-2 py-1 text-xs font-semibold">
                Featured
            </div>
            <div className="text-center mt-4 p-6">
                <h2
                className={`${lato.className} text-3xl text-houseBlue font-bold mb-4`}
                >
                No Active Subscriptions
                </h2>
                <p className="text-gray-600 mb-6">
                You currently don't have any subscriptions. Explore our plans and
                choose the one that fits your needs.
                </p>
                <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Why Subscribe?
                </h3>
                <ul className="text-gray-600 text-left space-y-4">
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Advanced Reselling Tools
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    All Deal-Finding Bots
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Live Alerts In Your Server
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Increase Your Servers Value
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Priority Customer Support
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Continual Monitor Additions
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Ad-Free Experience
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Network With Other Resellers
                    </li>
                    <li>
                    <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-houseBlue" />{" "}
                    Self Promotion Access
                    </li>
                </ul>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <DashboardNoSubscriptionButton username={username} />
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default DashboardNoSubscription;
