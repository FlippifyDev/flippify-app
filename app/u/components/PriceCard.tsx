import PriceStat from "./PriceStat";
import SubscribeNow from "./SubscribeNow";
import Image from "next/image";

interface PriceCardProps {
  title: string;
  prices: number[]
  description: string;
  image: string;
  priceId: string;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, prices, description, image, priceId }) => {
  return (
    <div className="m-5 lg:w-3/5">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90 border border-white sm:flex sm:justify-center sm:flex-col">
        {/* Image Section */}
        <div className="lg:flex lg:flex-row lg:items-center">
          <div className="p-2">
            <Image
              src={image}
              alt="Product Image"
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
          
          {/* Price and Description Section */}
          <div className="w-full lg:w-3/4 xl:w-3/4 p-4 lg:p-6 ">
            <h2 className="card-title text-white text-xl lg:text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white text-sm lg:text-base mb-4">{description}</p>
            {prices.length > 0 && <PriceStat prices={prices} />}
            <div className="flex justify-end">
              {prices.length > 0 && <SubscribeNow priceId={priceId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceCard
