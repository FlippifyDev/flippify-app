import PlanCard from "./PlanCard";

const PricingContent = () => {
  return (
    <div className="flex flex-col items-center space-y-10 mt-10 mb-10">
      <PlanCard
        title="Lego Retirement Deals"
        description="Monitors soon to retire lego sets across multiple websites"
        monthly_plan={29.99}
        three_month_plan={24.99}
        yearly_plan={19.99}
        image="https://i.imgur.com/3rj6JKr.png"
      />
      <PlanCard
        title="Coming Soon..."
        description="Many more deals coming your way shortly."
        monthly_plan={19.99}
        three_month_plan={14.99}
        yearly_plan={12.99}
        image="https://i.imgur.com/lok7Wcq.png"
      />
    </div>
  );
};

export default PricingContent;
