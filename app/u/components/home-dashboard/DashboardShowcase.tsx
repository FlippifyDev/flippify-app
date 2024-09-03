import React from "react";
import { BentoGrid, BentoGridItem } from "../../../../components/ui/bento-grid";
import Image from 'next/image';
import { FaPeopleGroup, FaMapLocationDot } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import { MdAutoAwesome } from "react-icons/md";


const DashboardShowcase: React.FC = () => {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] gap-6 p-8 py-10 h-full">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={`h-full flex flex-col justify-between ${item.className} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`} // Added default shadow
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
};

const items = [
  {
    title: "AI Automation",
    description: "Automate your entire reselling process - from finding your products to ready for shipping - with our AI tools, including automatic eBay listing creation and order fulfillment.",
    header: (
      <div className="w-full h-full flex items-start justify-center">
        <Image
          src="https://i.imgur.com/wVF5XTQ.png"
          alt="AI Automation"
          width={530}
          height={145}
          className="object-contain rounded-lg shadow-lg"
        />
      </div>
    ),
    className: "md:col-span-2",
    icon: <MdAutoAwesome className="h-4 w-4 text-houseBlue" />,
  },
  {
    title: "Advanced Tracking",
    description: "Track your profits, expenses, and inventory automatically with our built-in financial management tools.",
    header: (
      <div className="w-full h-full flex items-start justify-center">
        <Image
          src="https://i.imgur.com/NLv4dfZ.png"
          alt="Advanced Tracking"
          width={230}
          height={145}
          className="object-contain rounded-lg shadow-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <FaMapLocationDot className="h-4 w-4 text-houseBlue" />,
  },
  {
    title: "Expert Community Support",
    description: "Connect with specialists and network with professional resellers. Get the help you need to scale your business.",
    header: (
      <div className="w-full h-full flex items-start justify-center">
        <Image
          src="https://i.imgur.com/RqQ6Rca.png"
          alt="Expert Community Support"
          width={230}
          height={145}
          className="object-contain rounded-lg shadow-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <FaPeopleGroup className="h-4 w-4 text-houseBlue" />,
  },
  {
    title: "Smart Deal-Finding Bots",
    description: "Discover the most profitable deals across categories like electronics, LEGO, and more. We ensure you never miss an opportunity.",
    header: (
      <div className="w-full h-full flex items-start justify-center">
        <Image
          src="https://i.imgur.com/tGRyyc9.png"
          alt="Smart Deal-Finding Bots"
          width={530}
          height={145}
          className="object-contain rounded-lg shadow-lg"
        />
      </div>
    ),
    className: "md:col-span-2",
    icon: <FaRobot className="h-4 w-4 text-houseBlue" />,
  },
];

export default DashboardShowcase;
