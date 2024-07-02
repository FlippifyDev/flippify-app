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
    <div className="m-5 w-96 lg:w-4/5 xl:w-3/5">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90 border border-white">
        <figure className="w-full lg:w-1/3 max-w-96 min-w-54">
          <Image
            src={image}
            alt="Product Image"
            style={{ aspectRatio: '1' }}
            width={1000}
            height={1000}
          />
        </figure>
        <div className="card-body">
          <div className="ml-2">
            <h2 className="card-title mb-2 text-white">{title}</h2>
            <p className="text-wrap">{description}</p>
          </div>
          {prices.length > 0 && (
            <div className="my-auto">
              <PriceStat prices={prices} />
            </div>
          )}
          {prices.length > 0 && (
            <div className="card-actions justify-end">
              <SubscribeNow priceId={priceId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PriceCard
