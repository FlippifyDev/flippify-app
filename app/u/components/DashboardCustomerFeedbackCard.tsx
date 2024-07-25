import React from 'react';

const DashboardCustomerFeedbackCard: React.FC = () => {
  return (
    <div className="card bg-white shadow-md rounded-lg p-4">
      <h2 className="card-title text-lightModeText text-xl font-semibold">
        Customer Feedback
      </h2>
      <div className="mt-4">
        <a href="https://discord.com/your-discord-channel" target="_blank" rel="noopener noreferrer" className="btn btn-primary bg-houseBlue text-white">
          Give us Suggestions
        </a>
      </div>
    </div>
  );
};

export default DashboardCustomerFeedbackCard;
