import React from "react";
import PlanCard from "./PlanCard";

const Plans = () => {
  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      <PlanCard image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" title="Shoes" description="If a dog chews shoes whose shoes does he choose?"/>
      <PlanCard image="https://images-na.ssl-images-amazon.com/images/I/91K5JOBomKL._SL1500_.jpg" title="Lego Retirement Sales" description="Monitor soon to retire lego sets across multiple websites."/>
    </div>
  );
};

export default Plans;
