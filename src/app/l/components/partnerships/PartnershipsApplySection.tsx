import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsApplySection = () => {
    const [businessType, setBusinessType] = useState<string>('');
    const [formStatus, setFormStatus] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // This properly types the event parameter to fix the TypeScript error
    const handleBusinessTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setBusinessType(e.target.value);
    };

    // Function to handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create a FormData object from the form
        const formData = new FormData(e.currentTarget);
        const formValues: Record<string, string> = {};

        // Convert FormData to a plain object
        formData.forEach((value, key) => {
            formValues[key] = value.toString();
        });

        try {
            const response = await fetch('https://formspree.io/f/xqapwava', {
                method: 'POST',
                body: JSON.stringify(formValues),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setFormStatus('success');
                // Reset form
                (e.target as HTMLFormElement).reset();
                setBusinessType('');
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            setFormStatus('error');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column - Heading and Text */}
                <div className="flex flex-col justify-start">
                    <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6`}>
                        Join the Flippify Partner Network Today
                    </h2>
                    <p className="text-left text-lg text-lightModeText font-semibold mb-6">
                        We&apos;re in beta and building fast—get started by exploring our current tools on the product pages and what&apos;s ahead on our roadmap. Ready to join us? Express your interest below!
                    </p>
                    <p className="text-left text-lightModeText mb-4">
                        Have questions or need support? Email us at{" "}
                        <a href="mailto:partnerships@flippify.io" className="text-houseBlue font-medium hover:underline">
                            partnerships@flippify.io
                        </a>
                    </p>
                    <p className="text-left text-lightModeText mb-4">
                        We&apos;re ready to onboard partners like reselling groups, eBay sellers, software providers, consultants, and more. Join us now to start leveraging our AI-driven tools, with much more in development to enhance your clients&apos; success. For example, reselling group leaders can immediately empower their members with our automation solutions!
                    </p>
                </div>

                {/* Right Column - Form */}
                <div className="bg-white shadow-lg rounded-3xl p-6 md:p-8">
                    <h3 className={`${inter.className} text-2xl font-bold text-lightModeText mb-6`}>
                        Ready to Partner with Flippify?
                    </h3>

                    {formStatus === 'success' ? (
                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                            <h4 className="text-xl font-medium text-houseBlue mb-2">Thank you for your interest!</h4>
                            <p className="text-houseBlue">
                                We&apos;ve received your submission and will be in touch soon. Meanwhile, feel free to explore our product pages to learn more about what we offer.
                            </p>
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company/Group Name</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    placeholder="Acer Resellers"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Company Website / Group Link</label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    placeholder="example.com"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country/Location</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    placeholder="United States"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">Type of Business</label>
                                <select
                                    id="businessType"
                                    name="businessType"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                    required
                                    value={businessType}
                                    onChange={handleBusinessTypeChange}
                                >
                                    <option value="">Select an option</option>
                                    <option value="reselling-group">Reselling Group</option>
                                    <option value="ebay-seller">eBay Seller</option>
                                    <option value="software-provider">Software Provider</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {businessType === 'other' && (
                                <div>
                                    <label htmlFor="otherBusinessType" className="block text-sm font-medium text-gray-700 mb-1">Please specify your business type</label>
                                    <input
                                        type="text"
                                        id="otherBusinessType"
                                        name="otherBusinessType"
                                        placeholder="Other business type"
                                        className="input input-bordered w-full bg-white placeholder-gray-400"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">What are your main goals for partnering with Flippify?</label>
                                <textarea
                                    id="goals"
                                    name="goals"
                                    rows={3}
                                    placeholder="To further equip my clients in their selling journey."
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                ></textarea>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="betaTesting"
                                        name="betaTesting"
                                        type="checkbox"
                                        className="focus:ring-houseBlue h-4 w-4 text-houseBlue border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="betaTesting" className="font-medium text-gray-700">Interested in providing feedback or participating in beta testing?</label>
                                    <p className="text-gray-500">Your input can help us improve during beta!</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="referral" className="block text-sm font-medium text-gray-700 mb-1">How did you hear about Flippify?</label>
                                <input
                                    type="text"
                                    id="referral"
                                    name="referral"
                                    placeholder="e.g., social media, friend, search"
                                    className="input input-bordered w-full bg-white placeholder-gray-400"
                                />
                            </div>

                            {formStatus === 'error' && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                                    Something went wrong. Please try again or contact us directly.
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-houseHoverBlue hover:bg-houseBlue transition duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-houseBlue"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Interest'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnershipsApplySection;