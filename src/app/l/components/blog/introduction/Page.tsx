import React from 'react'
import Hero from '../../dom/Hero'
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
    const connectAccountSteps = [
        {
            title: "Select Your Marketplace and Click “Connect”",
            image: "https://i.imgur.com/30RPXjy.png",
            alt: "Marketplace selection dropdown with “Connect” button highlighted"
        },
        {
            title: "Authenticate Your Account in the Popup",
            image: "https://i.imgur.com/tOK7Pdo.png",
            alt: "eBay login screen showing username and password fields"
        },
        {
            title: "Flippify Begins Syncing Your Listings",
            image: "https://i.imgur.com/YKPeiOM.png",
            alt: "Dashboard view showing synced inventory items from eBay"
        }
    ];


    const editItemsSteps = [
        {
            title: "Inline-Edit Inventory and Order Fields",
            image: "https://i.imgur.com/MmrDDqD.png",
            alt: "Editable table with inventory and order columns"
        },
        {
            title: "Right-Click an Item and Choose “Edit”",
            image: "https://i.imgur.com/0i8dYLV.png",
            alt: "Context menu over a table row with “Edit Item” option"
        },
        {
            title: "View Full Order Details and Payout Estimates",
            image: "https://i.imgur.com/PXoOKyv.png",
            alt: "Order details panel showing history, status, and estimated payout"
        }
    ];

    const shippingAndFulfillmentSteps = [
        {
            title: "Navigate to Shipping & Fulfillment",
            image: "https://i.imgur.com/jsbmYbz.png",
            alt: "Shipping & Fulfillment dashboard listing pending shipments"
        },
        {
            title: "Select Items to Mark as Shipped",
            image: "https://i.imgur.com/FotF2i6.png",
            alt: "List of orders that are ready to shipped and have been shipped"
        }
    ];

    const oneTimeExpensesSteps = [
        {
            title: "Track All Business-Related Transactions",
            image: "https://i.imgur.com/7OcLXdm.png",
            alt: "Expense log showing date, category, and amount columns"
        },
        {
            title: "Quickly Add a New Expense Entry",
            image: "https://i.imgur.com/8RZNQVg.png",
            alt: "Expense modal with fields for amount, category, and notes"
        },
        {
            title: "Review and Manage Your Expense History",
            image: "https://i.imgur.com/1yqXzwf.png",
            alt: "Expenses table with filtering"
        }
    ];


    const financialHubSteps = [
        {
            title: "View Your Store’s Financial Dashboard",
            image: "https://i.imgur.com/dItbZsY.png",
            alt: "Financial hub overview showing revenue, profit, and expense charts"
        },
        {
            title: "Analyze Shipping Performance & Cost Breakdown",
            image: "https://i.imgur.com/QqVexiP.png",
            alt: "Chart comparing shipping times and costs across different carriers"
        },
        {
            title: "Export Your Order Data for Offline Analysis",
            image: "https://i.imgur.com/Tj3p6Cu.png",
            alt: "Export dialog with options to download order data as CSV"
        }
    ];

    const taxReportingSteps = [
        {
            title: "Access Your Tax Reporting Dashboard",
            image: "https://i.imgur.com/MTV1pgq.png",
            alt: "Tax reporting dashboard showing summary cards for income, inventory, COGS, and expenses"
        },
    ];


    return (
        <div className="min-h-screen w-full flex flex-col items-center overflow-x-auto scrollbar-hide">
            <div>
                <Hero
                    text={[
                        { text: "Getting " },
                        { text: "started", isGradient: true },
                        { text: "with Flippify" }
                    ]}
                    description="Explore the key features of Flippify and learn how to get the most out of the platform. This guide covers everything from navigating the dashboard to uploading your first sales and managing inventory efficiently."
                    image="/blog/Introduction.svg"
                    imageAlt="Illustration of a user exploring features on the Flippify platform"
                    imageContainerClassName="pb-20 scale-125"
                    titleClassName="lg:w-3/5"
                />
            </div>
            <div className='w-full flex flex-col items-center space-y-32 max-w-6.5xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-fadeInBounce mt-[250px] xs:mt-[200px] sm:mt-[200px] md:mt-[250px] lg:mt-[270px] 2xl:mt-[320px] mb-12'>
                <SectionContent title="Connect Account" href="connect-account" steps={connectAccountSteps} />
                <SectionContent title="Edit Inventory & Orders" href="edit-inventory-and-orders" steps={editItemsSteps} />
                <SectionContent title="Shipping & Fulfillment" href="shipping-and-fulfillment" steps={shippingAndFulfillmentSteps} />
                <SectionContent title="One Time Expenses" href="one-time-expenses" steps={oneTimeExpensesSteps} />
                <SectionContent title="Finacial Hub" href="financial-hub" steps={financialHubSteps} />
                <SectionContent title="Tax Report" href="tax-reporting" steps={taxReportingSteps} />
            </div>
        </div>
    )
}

interface SectionContentProps {
    title: string;
    href: string;
    steps: {
        title: string;
        image: string;
        alt: string;
    }[]
}
const SectionContent: React.FC<SectionContentProps> = ({ title, href, steps }) => {
    return (
        <section id={href} className='font-semibold space-y-8 scroll-mt-24'>
            <Link href={`#${href}`} scroll={false} className='text-3xl mb-5 font-semibold scroll-mt-24'>
                {title}
            </Link>
            {steps.map((step, index) => (
                <div key={index} className='space-y-4'>
                    <h1 className='text-lg'>
                        Step {index + 1}: {step.title}
                    </h1>
                    <div className='flex justify-start'>
                        <figure className="border-2 border-white bg-gray-100/80 p-3 rounded-4xl shadow-lg">
                            <Image
                                src={step.image}
                                alt={step.alt}
                                width={800}
                                height={400}
                                loading="lazy"
                                className="rounded-3xl"
                            />
                        </figure>
                    </div>
                </div>
            ))}
        </section>
    )
}


export default Page
