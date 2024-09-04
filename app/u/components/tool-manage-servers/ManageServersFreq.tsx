import React, { useState } from "react";

interface MyComponentProps {
    className?: string;
  }
  
const Frequency: React.FC<MyComponentProps> = () => {
  const [frequency, setFrequency] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(Number(e.target.value));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/updateFrequency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frequency }),
      });

      if (response.ok) {
        alert("Frequency updated successfully!");
      } else {
        alert("Failed to update frequency.");
      }
    } catch (error) {
      console.error("Error updating frequency:", error);
      alert("An error occurred while updating the frequency.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label htmlFor="frequency" className="text-lg font-semibold">
        Enter Delay Between Actions (in minutes):
      </label>
      <input
        id="frequency"
        type="number"
        value={frequency}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md p-2 w-32 text-center"
        min="0"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Frequency;
