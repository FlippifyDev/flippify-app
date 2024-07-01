import PriceStat from "./PriceStat";
import SubscribeNow from "./SubscribeNow";
import Image from "next/image";

interface PlanCardProps {
    title: string;
    monthly_plan: number;
    three_month_plan: number;
    yearly_plan: number;
    description: string;
    image: string;
}
  

const PlanCard: React.FC<PlanCardProps> = ({ title, monthly_plan, three_month_plan, yearly_plan, description, image}) => {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl border border-white opacity-90">
        <figure>
            <Image
            src={image}
            alt="Product Image"
            className="w-100 h-96"
            style={{ aspectRatio: '1' }}
            />
        </figure>
        <div className="card-body">
            <div>
                <h2 className="card-title mb-4 text-white">{title}</h2>
                <p>{description}</p>
            </div>
            <div className="my-auto">
                <PriceStat monthly_plan={monthly_plan} three_month_plan={three_month_plan} yearly_plan={yearly_plan}/>
            </div>
            <div className="card-actions justify-end">
                <SubscribeNow />
            </div>
        </div>
    </div>
  )
}

export default PlanCard
