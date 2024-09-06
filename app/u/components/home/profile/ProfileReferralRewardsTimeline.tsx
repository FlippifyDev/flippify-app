"use client";

import React, { useState, useEffect, useRef } from "react";

interface Reward {
  id: number;
  leftOption: string;
  rightOption: string;
}

interface ReferralRewardsTimelineProps {
  availableRewards: number;
  selectedRewards: { [key: number]: string };
  handleRewardSelection: (tier: number, reward: string) => void;
  totalRewardsClaimed: number;
}

const ReferralRewardsTimeline: React.FC<ReferralRewardsTimelineProps> = ({
  availableRewards,
  selectedRewards,
  handleRewardSelection,
  totalRewardsClaimed,
}) => {
  const rewardsPerPage = 4; // Number of rewards to show per page
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define the base rewards
  const baseRewards: Reward[] = [
    { id: 1, leftOption: "£5 Cash Reward", rightOption: "25% Off Next Month" },
    { id: 2, leftOption: "£10 Cash Reward", rightOption: "50% Off Next Month" },
    { id: 3, leftOption: "£15 Cash Reward", rightOption: "One Free Month" },
  ];

  // Adding placeholders for remaining rewards, filling up to total referrals.
  const allRewards = [...baseRewards];
  while (allRewards.length < availableRewards + totalRewardsClaimed) {
    allRewards.push({
      id: allRewards.length + 1,
      leftOption: "£15 Cash Reward",
      rightOption: "One Free Month",
    });
  }

  const totalPages = Math.ceil(allRewards.length / rewardsPerPage);
  const startTier = currentPage * rewardsPerPage;
  const visibleRewards = allRewards.slice(startTier, startTier + rewardsPerPage);

  useEffect(() => {
    // Set the initial height based on the first page's content
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      containerRef.current.style.height = `${height}px`;
    }
  }, [currentPage]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div
        ref={containerRef}
        className="transition-all duration-200"
        style={{ minHeight: "200px" }} // Minimum height to keep the menu stable
      >
        <ul className="timeline timeline-vertical">
          {visibleRewards.map((reward, index) => {
            const tierIndex = startTier + index + 1;
            const isSelectedLeft = selectedRewards[tierIndex] === reward.leftOption;
            const isSelectedRight = selectedRewards[tierIndex] === reward.rightOption;
            const isDisabled = tierIndex <= totalRewardsClaimed;

            return (
              <li key={reward.id} className="flex items-center mb-4">
                {/* Left Option */}
                <div className="flex-1 px-2">
                  <button
                    className={`w-full p-4 rounded-lg transition-all duration-200 border bg-white ${
                      isSelectedLeft
                        ? "shadow-lg border-houseBlue"
                        : "shadow-md border-transparent hover:shadow-lg"
                    } ${
                      isDisabled
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "hover:border-houseHoverBlue"
                    }`}
                    onClick={() => handleRewardSelection(tierIndex, reward.leftOption)}
                    disabled={isDisabled}
                  >
                    {reward.leftOption}
                  </button>
                </div>

                {/* Timeline Icon */}
                <div className="flex flex-col items-center mx-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-5 w-5 ${isDisabled ? "text-gray-400" : "text-houseBlue"}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {index < visibleRewards.length - 1 && (
                    <div className={`w-px h-8 ${isDisabled ? "bg-gray-300" : "bg-houseBlue"}`}></div>
                  )}
                </div>

                {/* Right Option */}
                <div className="flex-1 px-2">
                  <button
                    className={`w-full p-4 rounded-lg transition-all duration-200 border bg-white ${
                      isSelectedRight
                        ? "shadow-lg border-houseBlue"
                        : "shadow-md border-transparent hover:shadow-lg"
                    } ${
                      isDisabled
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "hover:border-houseHoverBlue"
                    }`}
                    onClick={() => handleRewardSelection(tierIndex, reward.rightOption)}
                    disabled={isDisabled}
                  >
                    {reward.rightOption}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 transition-all duration-200 border border-gray-300 rounded-l-lg bg-white text-gray-700 hover:bg-gray-100 ${
              currentPage === 0 ? "text-gray-400 cursor-not-allowed" : "hover:border-gray-400"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            &larr; Prev
          </button>
          <button
            className={`px-4 py-2 transition-all duration-200 border border-gray-300 rounded-r-lg bg-white text-gray-700 hover:bg-gray-100 ${
              currentPage === totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "hover:border-gray-400"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default ReferralRewardsTimeline;
