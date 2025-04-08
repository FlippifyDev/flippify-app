"use client";

import Hero from "../dom/Hero";
import PartnershipsBusinessDetails from "./PartnershipsBusinessSection";
import PartnershipsClientDetails from "./PartnershipsClientSection";
import PartnershipsEventsDetails from "./PartnershipsEventsSection";
import PartnershipsJoinDetails from "./PartnershipsJoinSection";
import PartnershipsApplySection from "./PartnershipsApplySection";
import PartnershipsSuccessSection from "./PartnershipsSuccessSection";
import PartnershipsFAQSection from "./PartnershipsFAQSection";
import PartnershipsApplyButton from "./PartnershipsApplyButton";

const PartnershipsContent = () => {
    return (
        <div className="partnerships-details-container">
            <Hero
                text={[{ text: "Grow your business" }, { text: "as a", }, { text: "Flippify", isGradient: true }, { text: "partner" }]}
                description="Partner with Flippify to unlock new revenue streams, enhance your offerings, and empower your clients with cutting-edge e-commerce automation."
                button={<PartnershipsApplyButton />}
                image="/hero/partnerships.svg"
                imageAlt="Flippify Partnerships"
                imageContainerClassName="scale-125"
            />

            <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                <div className="py-20">
                    <PartnershipsBusinessDetails />
                </div>
                <div className="w-full border-b border-dashed"></div>
                <div className="py-20">
                    <PartnershipsClientDetails />
                </div>
                <div className="w-full border-b border-dashed"></div>
                <div className="py-20">
                    <PartnershipsEventsDetails />
                </div>
                <div className="w-full border-b border-dashed"></div>
                <div className="py-20">
                    <PartnershipsJoinDetails />
                </div>
                <div className="w-full border-b border-dashed"></div>
                <div className="py-20">
                    <PartnershipsApplySection />
                </div>
                <div className="w-full border-b border-dashed"></div>
                <div className="py-20">
                    <PartnershipsSuccessSection />
                </div>
                <div className="w-full border-b border-dashed"></div>
                <div className="py-20">
                    <PartnershipsFAQSection />
                </div>
            </div>

            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[150px] xl:pt-[180px]" />
        </div>
    );
};

export default PartnershipsContent;