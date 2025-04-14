"use client";

import { useState } from "react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full border border-gray-300 rounded-lg mb-4">
            <button
                type="button"
                className="w-full py-4 px-6 rounded-lg bg-gray-50 text-left flex items-center justify-between"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-lightModeText">{question}</span>
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6 text-lightModeText">
                    {answer}
                </div>
            </div>
        </div>
    );
};

interface FAQSectionProps {
    title: string;
    items: FAQItemProps[];
}

const FAQSection = ({ title, items }: FAQSectionProps) => {
    return (
        <div className="mb-12">
            <h2 className={`${inter.className} text-2xl font-bold text-lightModeText mb-6`}>
                {title}
            </h2>
            <div>
                {items.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
};

export default function FAQPage() {
    const generalQuestions = [
        {
            question: "What is Flippify, and how does it help eBay sellers?",
            answer: "Flippify is the all you need solution to the tedious, repetitive, time consuming tasks that come with running an eBay selling operation. We simplify store operations by centralizing order management, inventory tracking, financial insights, and all other necessities for running your store in one intuitive hub. Flippify helps you save time, reduce errors, and scale your eBay business more efficiently without the hassle of juggling multiple tools or spreadsheets."
        },
        {
            question: "How does Flippify simplify managing my eBay store?",
            answer: "Flippify simplifies eBay store management by providing a unified dashboard where you can track orders, manage inventory, analyze finance's, and handle customer communications—all in one place. It automates repetitive tasks like inventory updates and order processing, reducing manual work and potential errors. This all-in-one approach eliminates the need to switch between multiple platforms or maintain complex spreadsheets, saving you valuable time and helping you run your store more efficiently."
        },
        {
            question: "Is Flippify suitable for sellers with multiple eBay stores?",
            answer: "We are working fast to ensure it is! Flippify is actively developing support for multiple eBay stores which will be included over a range of our plans, different plans will support a different number of stores per account. Our platform will allow you to connect and monitor all your eBay stores from a single dashboard, giving you a consolidated view of operations across your entire business. You can easily switch between stores, compare performance metrics, manage inventory across multiple storefronts, and maintain consistent customer service standards—all without having to log in and out of different accounts."
        },
        {
            question: "Do I need technical skills to use Flippify?",
            answer: "No technical skills are required to use Flippify. We've designed the platform to be intuitive and user-friendly, even for sellers who aren't tech-savvy. The setup process is straightforward with step-by-step guidance, and the dashboard features a clean, easy-to-navigate interface. All functionalities are designed with simplicity in mind, allowing you to start benefiting from Flippify's features immediately without a steep learning curve."
        }
    ];

    const featureQuestions = [
        {
            question: "How does Flippify's Order Management system work with eBay?",
            answer: "Flippify's Order Management system integrates directly with your eBay account to automatically import and organize all your orders in real-time. Once connected, you'll see new orders appear instantly in your Flippify dashboard, complete with buyer information, item details, and shipping deadlines, tracking order statuses from start to end so no item is missed. We are currently developing systems to further automate the process such as sending automated notifications, buyer communication in-house (including AI Automated replies), automatically managing shipping labels, and even managing returns for you—all while keeping your eBay account synchronized. This eliminates the need for manual order tracking and reduces the risk of overlooking orders or making fulfillment errors."
        },
        {
            question: "Can Flippify help me manage my inventory in real-time?",
            answer: "Yes, Flippify provides real-time inventory management across all your eBay listings. The system automatically updates stock levels as sales occur, preventing overselling and the negative feedback that comes with it. You can set low-stock alerts, track inventory across multiple locations, monitor product performance, and easily make bulk updates to your listings. Flippify also provides insights into inventory turnover and suggests optimal stock levels based on your sales history, helping you make informed decisions about restocking and product selection."
        },
        {
            question: "Does Flippify provide financial insights for my eBay sales?",
            answer: "Absolutely. Flippify's financial tools give you comprehensive insights into your eBay business performance. The platform tracks all revenue, fees, shipping costs, and other expenses to calculate accurate profit margins for each sale and your overall business. You can view detailed financial reports, analyze profitability by product category or time period, track trends, and export data for accounting purposes. These insights help you identify your most profitable products, understand seasonal patterns, and make data-driven decisions to increase your bottom line. Simply input purchase costs with a few clicks for new inventory items, and we handle the rest from there."
        },
        {
            question: "What tools does Flippify offer for communicating with customers?",
            answer: "Coming soon, Flippify will provide a robust communication suite that centralizes all customer interactions. The platform will automatically imports messages from eBay, organizes them by order, and allows you to respond directly through Flippify without switching platforms. You can create message templates for common scenarios, set up automated responses using our AI technology for frequently asked questions and other selected scenarios, and receive notifications for new messages. This streamlined approach ensures you never miss important customer communications and helps maintain high service standards, which is crucial for positive feedback and repeat business."
        },
        {
            question: "Will Flippify automatically sync my eBay listings and stock?",
            answer: "Yes, Flippify maintains continuous synchronization between your eBay listings and our platform. When you connect your eBay store, all existing listings are imported automatically. After that, any changes you make to inventory levels, pricing, or listing details in Flippify are instantly reflected on eBay, and vice versa. This two-way sync ensures your inventory data is always accurate across platforms, eliminating the risk of overselling or displaying outdated information to potential buyers."
        },
        {
            question: "What's the unified dashboard, and how does it help me?",
            answer: "The unified dashboard is Flippify's central command center that brings together all aspects of your eBay business in one place. It provides a simple but in-depth overview of your most important metrics—like sales performance, inventory status, outstanding orders, and when available, customer messages—all at a glance. From this single screen, you can quickly identify areas that need attention, track your business health, and access detailed features with just a click. This centralization eliminates the need to switch between multiple tools or screens, saving you time and giving you complete visibility into your operations."
        }
    ];

    const setupQuestions = [
        {
            question: "How do I connect my eBay store to Flippify?",
            answer: "Connecting your eBay store to Flippify is simple and secure. After creating your Flippify account, you'll be guided through an authorization process where you'll log into your eBay account and grant Flippify permission to access your store data. This uses eBay's official OAuth system, ensuring your credentials remain private. Once authorized, Flippify will begin importing your listings, orders, and other store data automatically. The entire process typically takes less than a few minutes, and our support team is available if you need any assistance during setup."
        },
        {
            question: "Is Flippify compatible with other marketplaces besides eBay?",
            answer: "Currently, Flippify is specifically optimized for eBay sellers and focuses on providing the best possible experience for this platform. We're constantly developing our product, and integration with additional marketplaces is on our roadmap for future updates. If you're selling on multiple platforms and would like to see specific marketplace integrations added to Flippify, we encourage you to share your feedback with our team, as this helps us prioritize development based on user needs."
        },
        {
            question: "Can I use Flippify on my mobile device?",
            answer: "Yes, Flippify is fully responsive and designed to work on all ranges of devices. You can access all features through your mobile device's web browser without downloading a separate app. The mobile interface is optimized for smaller screens while maintaining access to all the functionality of the desktop version. This allows you to manage your eBay business on the go—whether you need to check order status, respond to customer messages (when available), or update inventory levels while away from your computer."
        }
    ];

    const pricingQuestions = [
        {
            question: "How much does Flippify cost to use?",
            answer: "Flippify offers flexible pricing options designed to accommodate eBay sellers of all sizes. Our pricing structure is based on the volume of your monthly sales and the specific features you need. For detailed and current pricing information, please visit our Pricing page where you'll find a complete breakdown of our plans and what's included with each tier. We've structured our pricing to ensure that Flippify provides strong ROI by saving you time and helping increase your sales efficiency."
        },
        {
            question: "Is there a free plan for Flippify, or do I need a subscription?",
            answer: "Yes, Flippify offers a free plan with basic features to help you get started. This plan includes limited access to core functionalities with usage quotas designed for smaller sellers or those just testing the platform. While the free plan has certain limitations on sales volume and some advanced features, it provides a great way to experience Flippify's benefits before committing to a paid subscription. For sellers looking to grow or those with higher volume, our paid plans offer expanded capabilities and higher usage limits."
        },
        {
            question: "Are there any discounts available to eBay selling groups?",
            answer: "Yes, with our partnership program, any eBay / reselling group can apply for a discount on Flippify subscriptions. We offer discount codes to the groups for members to use, if your group isn't partnered with them yet, why not ask them, we ensure its beneficial to all parties, including you! This is a great way to provide your community with access to Flippify's powerful tools while saving money. To learn more about our partnership program and how to apply for group discounts, please visit our Partnerships page or contact our support team."
        },
    ];

    const supportQuestions = [
        {
            question: "What support options are available if I run into issues?",
            answer: "Flippify offers multiple support channels to ensure you get the help you need. All users have access to public discord server where our community is based, where many common questions are already answered and where you will always find a willing community or staff member to support you. Additionally, we provide email support at support@flippify.io, although response times may not be as hasty as discord tickets but we always aim to resolve matters within 24hrs. For critical issues, our team can also schedule one-on-one video calls to resolve complex problems, just open a ticket and we will support however necessary, our members are our number one priority. We're committed to providing exceptional support to help you get the most out of Flippify."
        },
        {
            question: "How often does Flippify release new features?",
            answer: "Flippify does not follow a regular update schedule simply because of what we are building. Our team spends a significant amount of time developing new features, meaning we aim to provide as much as we can, as soon as we can, however we never sacrifice quality for quantity, if something isn't working how we want it, we wont release it just because we need to meet a deadline. We are always aiming to provide new content and updates, each of which are on a different scale so constant deadlines set are not compatible with our operations, although don't be surprised if you find changes or new features when you log on tomorrow, we are always busy improving every area of our service. We also value user feedback and prioritize feature requests based on demand, so if you have suggestions for new features or improvements, please share them with us. We love hearing from our users and are always looking for ways to enhance the platform."
        },
        {
            question: "What upcoming features are on Flippify's roadmap?",
            answer: "You can view our current roadmap and goals in our products section. Our current roadmap includes several exciting features planned for upcoming releases, including seller-buyer communications with AI Utilization for automated responses, expanded reporting capabilities including tax reporting & accounting summaries, automated listings with the use of a browser extension or simply a product link - letting AI handle the rest listing the items on your store for you, and more automated workflows to further reduce manual tasks. We prioritize development based on user feedback and business impact, so we encourage you to share your feature requests with our team in our discord server."
        }
    ];

    const advancedQuestions = [
        {
            question: "Does Flippify offer an API for custom integrations?",
            answer: "Yes, We are actively working on providing API access for custom integrations on our upcoming enterprise plan. The API allows you to programmatically access your store data, automate workflows with your existing business systems, and build custom solutions tailored to your specific needs. Our API documentation will include comprehensive guides, code examples, and authentication details to help developers get started quickly. Due to enterprise users having complex integration requirements, our team can also provide additional support and consultation to ensure successful implementation."
        },
    ];

    const securityQuestions = [
        {
            question: "How does Flippify keep my eBay store data secure?",
            answer: "Flippify implements enterprise-grade security measures to protect your account & eBay store data. We use industry-standard encryption for all data in transit and at rest, maintain strict access controls within our systems, and regularly undergo security audits and penetration testing. Our integration with eBay uses OAuth authentication, meaning we never store your eBay password. We're compliant with relevant data protection regulations and maintain a comprehensive security policy that includes incident response procedures. Your business data is backed up regularly, and we employ multiple redundancies to ensure service reliability and data integrity."
        },
        {
            question: "Who is behind Flippify, and why should I trust it?",
            answer: "Flippify was created by a team of experienced eBay sellers who understand the challenges of running an e-commerce business firsthand. Our founding team has years of experience selling on eBay and faced the same pain points our platform now solves. We built Flippify because we needed it ourselves—a tool designed specifically for eBay sellers, by sellers who understand the business. Our founding team consists of experienced developers with a solid mission, and providing quality solutions to our members is our number one priority. We're transparent about our operations and dedicated to earning your trust through reliable service and tangible results for your business."
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <FAQSection title="General Questions" items={generalQuestions} />
            <FAQSection title="Features and Functionality" items={featureQuestions} />
            <FAQSection title="Setup and Compatibility" items={setupQuestions} />
            <FAQSection title="Pricing and Subscriptions" items={pricingQuestions} />
            <FAQSection title="Support and Future Features" items={supportQuestions} />
            <FAQSection title="Advanced Features and API" items={advancedQuestions} />
            <FAQSection title="Security and Trust" items={securityQuestions} />
        </div>
    );
}