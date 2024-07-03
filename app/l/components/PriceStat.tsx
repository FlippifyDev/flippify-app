interface PriceStatProps {
  prices: number[]
}

const PriceStat: React.FC<PriceStatProps> = ({prices}) => {
  return (
    <div className="stats stats-vertical xl:stats-horizontal lg:stats-horizontal md:stats-vertical shadow">
      <div className="stat">
        <div className="stat-title lg:text-sm">Monthly Plan</div>
        <div className="stat-value text-2xl sm:text-2xl md:text-3xl lg:text-2xl">£{prices[0]}</div>
        <div className="stat-desc">Yearly Fee £{prices[0] * 12}</div>
      </div>

      <div className="stat">
        <div className="stat-title lg:text-sm">3 Month Plan</div>
        <div className="stat-value text-2xl sm:text-2xl md:text-3xl lg:text-2xl line-through">£{prices[1]}</div>
        <div className="stat-desc line-through">Yearly Fee £{prices[1] * 12}</div>
      </div>

      <div className="stat">
        <div className="stat-title lg:text-sm">Yearly Plan</div>
        <div className="stat-value text-paymentPlanText text-2xl sm:text-2xl md:text-3xl lg:text-2xl line-through">£{prices[2]}</div>
        <div className="stat-desc text-paymentPlanText line-through">Yearly Fee £{prices[2] * 12}</div>
      </div>
    </div>
  );
};

export default PriceStat;
