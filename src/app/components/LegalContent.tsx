"use client"

import React, { useState } from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const LegalContent = () => {
	const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(true);

	const togglePrivacyPolicy = () => {
		setShowPrivacyPolicy(true);
	};

	const toggleTermsAndConditions = () => {
		setShowPrivacyPolicy(false);
	};

	return (
		<div className="bg-black bg-opacity-70 rounded-xl p-4 mx-2 mt-2">
			<ul className="flex">
				<li className="mr-4">
					<button
						className="text-white hover:underline"
						onClick={togglePrivacyPolicy}
					>
						Privacy Policy
					</button>
				</li>
				<li className="ml-1">
					<button
						className="text-white hover:underline"
						onClick={toggleTermsAndConditions}
					>
						Terms and Conditions
					</button>
				</li>
			</ul>
			<div className="mt-4">
				{showPrivacyPolicy ? <PrivacyPolicy /> : <TermsAndConditions />}
			</div>
		</div>
	);
};

export default LegalContent;