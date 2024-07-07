import LandingLayout from "../components/LandingLayout";

import { HiBellAlert } from "react-icons/hi2";
import { RiRobot2Fill } from "react-icons/ri";
import {
  MdOutlineSupportAgent,
  MdUpdate,
  MdOutlineSportsMartialArts,
} from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";

export default function About() {
  return (
    <LandingLayout>
      <div className="flex flex-col items-center justify-center flex-grow mt-10">
        <h1 className="text-5xl text-white font-bold mb-8">About Flippify.</h1>
        <p className="text-lg text-greyText text-center max-w-2xl mb-10">
          Providing lightning-fast alerts to exclusive deals on limited-release
          items, ensuring you never miss out on valuable opportunities.
        </p>
        <div className="bg-base-100 bg-opacity-80 p-8 rounded-3xl shadow-lg w-full max-w-4xl border-2 border-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            <FeatureCard
              title="Instant Alerts"
              description="Real-time notifications for the latest deals directly in Discord."
              icon={<HiBellAlert />}
            />
            <FeatureCard
              title="Fully Automated Bots"
              description="Seamless automation from web to Discord, saving time and boosting efficiency."
              icon={<RiRobot2Fill />}
            />
            <FeatureCard
              title="Constant Support"
              description="We are always here to help ensuring you don't miss a thing."
              icon={<MdOutlineSupportAgent />}
            />
            <FeatureCard
              title="Community Driven"
              description="Engage with a supportive community and share exclusive tips and deals."
              icon={<FaPeopleGroup />}
            />
            <FeatureCard
              title="Constant Updates"
              description="Frequent bot updates to cover more websites and improve performance."
              icon={<MdUpdate />}
            />
            <FeatureCard
              title="Proven Expertise"
              description="Years of experience in bot development, ensuring reliable and high-performing solutions."
              icon={<MdOutlineSportsMartialArts />}
            />
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-transparent rounded-lg shadow">
      <h2 className="text-white text-2xl">{icon}</h2>
      <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
      <p className="text-greyText text-md">{description}</p>
    </div>
  );
}
