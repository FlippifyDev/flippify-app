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
        image="https://i.imgur.com/Ia2ldBC.png"
      />
      <PlanCard
        title="Lego Retirement Deals"
        description="Monitors soon to retire lego sets across multiple websites"
        monthly_plan={19.99}
        three_month_plan={14.99}
        yearly_plan={12.99}
        image="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
      />
      <PlanCard
        title="Lego Retirement Deals"
        description="Monitors soon to retire lego sets across multiple websites"
        monthly_plan={19.99}
        three_month_plan={14.99}
        yearly_plan={12.99}
        image="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
      />
    </div>
  );
};

export default PricingContent;
