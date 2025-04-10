"use client";
import React from 'react';

const PartnershipsApplyButton = () => {
    const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const formElement = document.getElementById('contact-form');
        if (formElement) {
            // Calculate scroll position with offset (e.g., 100px from top)
            const offset = 100;
            const elementPosition = formElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            // Smooth scroll to position
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <a
            href="#contact-form"
            onClick={scrollToForm}
            className="btn bg-houseHoverBlue text-white rounded-lg px-6 sm:px-8 md:px-[30px] hover:bg-houseBlue hover:shadow-lg hover:pb-[2px] border-none transform-duration-400 transition-duration-400 animate-fadeInSecondary"
        >
            Apply to Join
        </a>
    );
};

export default PartnershipsApplyButton;