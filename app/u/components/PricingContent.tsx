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
        image="https://cdn.leonardo.ai/users/a47d5e66-3419-4c70-8651-b3e13a1a92ff/generations/7663f3db-8d99-4334-8575-a54492383aa4/Default_A_masterpiece_rough_color_pencil_sketch_of_a_realistic_3.jpg"
        productId="prod_QHN7yCbh6XYMPa"
      />
      <PlanCard
        title="Coming Soon..."
        description="Many more deals coming your way shortly."
        monthly_plan={19.99}
        three_month_plan={14.99}
        yearly_plan={12.99}
        image="https://cdn.leonardo.ai/users/a47d5e66-3419-4c70-8651-b3e13a1a92ff/generations/38af42da-ec10-4e55-b788-ddb0e8d7b43d/Default_A_vibrant_masterpiece_rough_color_pencil_sketch_of_a_r_2.jpg"
        productId="prod_example"
      />
    </div>
  );
};

export default PricingContent;
