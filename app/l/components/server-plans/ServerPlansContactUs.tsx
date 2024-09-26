import React from "react";

interface ServerPlansContactUsProps {
  specialPlan?: boolean;
  unavailable?: boolean;
}

const ServerPlansContactUs: React.FC<ServerPlansContactUsProps> = ({ specialPlan, unavailable }) => {
  const handleContactUsClick = () => {
    if (unavailable) return; // Do nothing if the button is unavailable
    window.open("https://discord.com/channels/1236428617962229830/1236436288442466394", '_blank', 'noopener,noreferrer');
  };

  // Define styles for the available button
  const availableBtnClass = specialPlan
    ? 'btn border-0 bg-houseBlue text-white w-2/3 mx-auto rounded-lg shadow-lg hover:bg-houseHoverBlue hover:text-white'
    : 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue w-2/3 mx-auto rounded-lg shadow-lg hover:bg-houseHoverBlue hover:text-white';

  // Define styles for the unavailable (Coming Soon) button
  const unavailableBtnClass = 'btn border-0 bg-gray-300 hover:bg-gray-300 text-gray-400 w-2/3 mx-auto rounded-lg shadow-lg cursor-not-allowed';

  // Determine the button class based on whether it's unavailable
  const btnClass = unavailable ? unavailableBtnClass : availableBtnClass;

  return (
    <div className="relative w-full flex flex-col justify-end">
      <button
        className={btnClass}
        onClick={handleContactUsClick}
        // No disabled attribute; just styled for unavailable state
      >
        {unavailable ? 'Coming Soon' : 'Contact Us'}
      </button>
    </div>
  );
};

export default ServerPlansContactUs;
