"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { HiOutlineFolder, HiOutlineClock, HiOutlineVideoCamera } from "react-icons/hi";
import Image from "next/image";

interface CourseCardProps {
	title: string;
	tagline: string;
	image: string;
	link: string;
	type: "yourCourses" | "otherCourses";
	progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ image, link, type, progress = 0, title, tagline }) => {
	const router = useRouter();

	const handleMoreInfoClick = () => {
		router.push(link);
	};

	return (
		<motion.div
			className="group relative w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg cursor-pointer transition duration-200"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		// onClick={handleMoreInfoClick} - Make available when ready
		>
			{/* Image container with opacity hover effect */}
			<div className="relative w-full h-auto">
				<Image
					src={image}
					alt="Course"
					className="w-full rounded-t-2xl transition-opacity duration-300"
					style={{ display: "block", maxWidth: "100%", opacity: 0.8 }} // Set initial lower opacity
					width={500} 
					height={500}
				/>
				{/* Coming Soon Box */}
				<div className="absolute inset-0 flex items-center justify-center opacity-100">
					<div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
						Coming Soon
					</div>
				</div>
			</div>

			{/* White Section below the image */}
			{type === "yourCourses" ? (
				<>
					<div className="ml-2 mt-2 font-semibold">{title}</div>
					<div className="ml-2 text-gray-600 text-sm">{tagline}</div>
					<div className="flex pt-4 justify-between text-gray-700 items-center px-14">
						<span className="flex items-center">
							<HiOutlineFolder className="mr-1" /> 6
						</span>
						<span className="flex items-center">
							<HiOutlineVideoCamera className="mr-1" /> 22
						</span>
						<span className="flex items-center">
							<HiOutlineClock className="mr-1" /> 70m
						</span>
					</div>
					<div className="w-full bg-white px-2 pb-2 pt-2 flex flex-col items-center justify-center">
						{/* Progress Bar */}
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-houseBlue h-2 rounded-full"
								style={{ width: `${progress}%` }}
							></div>
						</div>
						<p className="text-sm text-gray-700 flex justify-center">
							Progress: <span className="text-black ml-1">{progress}%</span>
						</p>
					</div>
				</>
			) : (
				<div className="p-2">
					<div className="ml-2 mt-2 font-semibold">{title}</div>
					<div className="ml-2 mb-4 text-gray-600 text-sm">{tagline}</div>
				</div>
			)}
		</motion.div>
	);
};

export default CourseCard;
