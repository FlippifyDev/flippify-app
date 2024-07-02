// Local Imports
import PlanCard from "./PlanCard";


const PlanList = () => {
  return (
    <div className="flex flex-wrap justify-center mt-10 mb-10 px-10">
      <PlanCard 
        title="Lego Retirement Sales" 
        plans={[29.99, 24.99, 19.99]}
        description="Monitor soon to retire lego sets across multiple websites." 
        image="https://i.imgur.com/lOcRZPP.jpeg" 
        priceId="price_1PQoNRJJRepiHZ8da9O9ni43"
      />
    </div>
  )
}


export default PlanList;
