import DashboardOverviewContent from "./DashboardCardOverviewContent";

const DashboardOverviewCard = () => {
  return (
    <div className="card bg-white w-full h-full shadow-md rounded-lg p-4">
      <h2 className="card-title text-lightModeText text-xl font-semibold">
        Overview - Coming Soon
      </h2>
      <div className="flex justify-center">
      <div role="tablist" className="tabs tabs-bordered mt-4 w-full mr-12 sm:mr-0">
        <input
          type="radio"
          name="overview-tabs"
          role="tab"
          className="tab px-3 ml-8 sm:ml-0"
          aria-label="Daily"
        />
        <div role="tabpanel" className="tab-content p-10">
          <DashboardOverviewContent type="daily" />
        </div>

        <input
          type="radio"
          name="overview-tabs"
          role="tab"
          className="tab px-3"
          aria-label="Weekly"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-10">
          <DashboardOverviewContent type="weekly" />
        </div>

        <input
          type="radio"
          name="overview-tabs"
          role="tab"
          className="tab px-3"
          aria-label="Monthly"
        />
        <div role="tabpanel" className="tab-content p-10">
          <DashboardOverviewContent type="monthly" />
        </div>

        <input
          type="radio"
          name="overview-tabs"
          role="tab"
          className="tab px-1"
          aria-label="Yearly"
        />
        <div role="tabpanel" className="tab-content p-10">
          <DashboardOverviewContent type="yearly" />
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;