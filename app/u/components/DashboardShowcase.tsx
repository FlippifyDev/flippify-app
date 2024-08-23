import React from "react";
import { BentoGrid, BentoGridItem } from "../../../components/ui/bento-grid";
import Image from 'next/image';
import { IconClipboardCopy, IconFileBroken, IconSignature, IconTableColumn } from "@tabler/icons-react";

const DashboardShowcase: React.FC = () => {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] gap-6 p-4">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={`flex flex-col justify-between ${item.className} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`} // Added default shadow
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
      <div className="w-full h-[150px] flex items-center justify-center">
        <Image
          src="https://i.imgur.com/tHCVfp2.png"
          alt="AI Automation"
          width={530}
          height={145}
          className="object-contain rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-2",
    icon: <IconClipboardCopy className="h-4 w-4 text-houseBlue" />,
  },
  {
    title: "Advanced Tracking",
    description: "Track your profits, expenses, and inventory automatically with our built-in financial management tools.",
    header: (
      <div className="w-full h-[150px] flex items-center justify-center">
        <Image
          src="https://i.imgur.com/NLv4dfZ.png"
          alt="Advanced Tracking"
          width={230}
          height={145}
          className="object-contain rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-houseBlue" />,
  },
  {
    title: "Expert Community Support",
    description: "Connect with specialists and network with professional resellers. Get the help you need to scale your business.",
    header: (
      <div className="w-full h-[150px] flex items-center justify-center">
        <Image
          src="https://i.imgur.com/RqQ6Rca.png"
          alt="Expert Community Support"
          width={230}
          height={145}
          className="object-contain rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-houseBlue" />,
  },
  {
    title: "Smart Deal-Finding Bots",
    description: "Discover the most profitable deals across categories like electronics, LEGO, and more. We ensure you never miss an opportunity.",
    header: (
      <div className="w-full h-[150px] flex items-center justify-center">
        <Image
          src="https://i.imgur.com/ufjNvIw.png"
          alt="Smart Deal-Finding Bots"
          width={530}
          height={145}
          className="object-contain rounded-lg"
        />
      </div>
    ),
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-houseBlue" />,
  },
];

export default DashboardShowcase;
