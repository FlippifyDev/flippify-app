interface PriceStatProps {
  monthly_plan: number;
  three_month_plan: number;
  yearly_plan: number;
}

const PriceStat: React.FC<PriceStatProps> = ({monthly_plan, three_month_plan, yearly_plan}) => {
  return (
    <div className="stats shadow">
      <div className="stat place-items-center">
        <div className="stat-title">Monthly Plan</div>
        <div className="stat-value">£{monthly_plan}</div>
        <div className="stat-desc">Yearly Fee £{monthly_plan * 12}</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">3 Month Plan</div>
        <div className="stat-value">£{three_month_plan}</div>
        <div className="stat-desc">Yearly Fee £{three_month_plan * 12}</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Yearly Plan</div>
        <div className="stat-value text-paymentPlanText">£{yearly_plan}</div>
        <div className="stat-desc text-paymentPlanText">Yearly Fee £{yearly_plan * 12}</div>
      </div>
    </div>
  );
};

export default PriceStat;
