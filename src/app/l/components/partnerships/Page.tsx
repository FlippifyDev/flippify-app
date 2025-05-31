"use client";

import Hero from "../dom/Hero";
import PartnershipsBusinessDetails from "./PartnershipsBusinessSection";
import PartnershipsClientDetails from "./PartnershipsClientSection";
import PartnershipsEventsDetails from "./PartnershipsEventsSection";
import PartnershipsApplySection from "./PartnershipsApplySection";
import PartnershipsSuccessSection from "./PartnershipsSuccessSection";
import PartnershipsApplyButton from "./PartnershipsApplyButton";

const Page = () => {
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
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>
                <div className="py-20">
                    <PartnershipsClientDetails />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>
                <div className="py-20">
                    <PartnershipsEventsDetails />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>
                <div className="py-20" id="contact-form">
                    <PartnershipsApplySection />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>
                <div className="pt-20">
                    <PartnershipsSuccessSection />
                </div>
            </div>

            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[150px] xl:pt-[180px]" />
        </div>
    );
};

export default Page;