"use client";

import React from "react";
import Link from 'next/link';
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaTiktok, FaInstagram } from 'react-icons/fa6';
import { Lato } from 'next/font/google';
import { discordLink, discordSupportLink, githubLink, instagramLink, productHuntLink, tiktokLink, xLink } from "@/utils/constants";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });


interface FooterlinkProps {
    text: string;
    href: string;
    target?: string | undefined;
}

const FooterLink: React.FC<FooterlinkProps> = ({ text, href, target }) => {
    return (
        <Link className="hover:text-gray-500 font-medium text-center md:text-start w-full text-sm transition duration-200 " href={href} target={target}>{text}</Link>
    );
}

const FooterColumn = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className='flex flex-col gap-2 h-full py-8 md:py-16'>{children}</div>
    )
}

const FooterTitle = ({ text }: Readonly<{ text: string }>) => {
    return (
        <h3 className="text-sm font-bold text-center md:text-start">{text}</h3>
    )
}


const FooterDivider = () => {
    return (
        <div className="h-full border-r border-dashed hidden md:block"></div>
    )
}

const Footer = () => {
    return (
        <footer className="w-full flex flex-col md:flex-row md:items-center md:justify-between text-footerText max-w-6xl mx-auto">
            <FooterDivider />

            <FooterColumn>
                <div className="h-full w-full flex flex-row md:flex-col items-center px-8 md:px-0 md:items-start gap-4 justify-between">
                    <a href="#" className={`${lato.className} text-2xl font-bold`}>flippify</a>
                    <p className="text-sm font-semibold text-gray-600">© {new Date().getFullYear()} Flippify</p>
                </div>
            </FooterColumn>

            <FooterDivider />

            { /* Products and Pricing */}
            <FooterColumn>
                <FooterTitle text="Products & pricing" />
                <FooterLink text="Pricing" href="/l/pricing" />
                <FooterLink text="Accounting Software" href="/l/accounting-software" />
                <FooterLink text="Inventory Management" href="/l/inventory-management" />
                <FooterLink text="Order Management" href="/l/order-management" />
                <FooterLink text="Store Management" href="/l/store-management" />
                <FooterLink text="Partnerships" href="/l/partnerships" />
            </FooterColumn>

            <FooterDivider />

            {/* About Section */}
            <FooterColumn>
                <FooterTitle text="Resources" />
                <FooterLink text="About Us" href="/l/about" />
                <FooterLink text="Privacy Policy" href="/l/privacy-policy" />
                <FooterLink text="Terms & Conditions" href="/l/terms-and-conditions" />
                <FooterLink text="FAQs" href="/l/faq" />
                <FooterLink text="Attributions" href="/l/attributions" />
                <FooterLink text="Sitemap" href="/sitemap.xml" />
            </FooterColumn>

            <FooterDivider />

            {/* Other websites Section */}
            <FooterColumn>
                <FooterTitle text="Support" />
                <FooterLink text="Contact us" href="/l/contact" />
                <FooterLink text="Support discord" href={discordSupportLink} />
            </FooterColumn>

            <FooterDivider />

            {/* Social Media Section */}
            <FooterColumn>
                <FooterTitle text="Socials" />
                <FooterLink target="_blank" text="TikTok" href={tiktokLink} />
                <FooterLink target="_blank" text="x.com" href={xLink} />
                <FooterLink target="_blank" text="Discord" href={discordLink} />
                <FooterLink target="_blank" text="Instagram" href={instagramLink} />
                <FooterLink text="Github" href={githubLink} />
                <FooterLink text="Product Hunt" href={productHuntLink} />
            </FooterColumn>

            <FooterDivider />
        </footer>
    );
};


export default Footer;