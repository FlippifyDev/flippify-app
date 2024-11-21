// External Imports
import Link from 'next/link';
import React from 'react';
import { useEffect, useState } from 'react';

// Local Imports
import { formatTimePastTimestamp, formatTimeUntil } from '@/src/utils/format-dates'
import { IMonitorCard } from '@/src/models/mongodb/monitors/monitor-card';
import { truncateText } from '@/src/utils/truncate-text';
import AnimationArrow from '@/src/app/components/AnimationArrow';
import ImageModal from '@/src/app/components/ImageModal';


interface CardProps {
	data: IMonitorCard;
}

const Card: React.FC<CardProps> = ({ data }) => {
	const [timeUntilRelease, setTimeUntilRelease] = useState<string | null>(null);
	const truncatedTitle = truncateText(data.title, 60);
	const sections = data.sections;

	// Set the height of the cards
	const [cardHeight] = useState<string>(() =>
		data.cardHeight ? `h-[${data.cardHeight}]` : `h-[33rem]`
	);

	// Handle live countdown for release date
	useEffect(() => {
		if (data.release_date) {
			// Set initial value
			setTimeUntilRelease(formatTimeUntil(new Date(data.release_date)));

			// Update every second
			const intervalId = setInterval(() => {
				setTimeUntilRelease(formatTimeUntil(new Date(data.release_date)));
			}, 1000);

			// Cleanup interval on unmount
			return () => clearInterval(intervalId);
		}
	}, [data.release_date]);

	return (
		<div className={`grid grid-rows-10 bg-white shadow-lg rounded-lg overflow-hidden w-86 pt-2 pb-0 ${cardHeight}`}>
			{/* Title Section */}
			<section className='row-span-3 grid grid-cols-12 p-2 gap-2 mx-2'>
				<div className='col-span-8'>
					<h5 className='text-sm mb-2 text-gray-600 font-semibold'>{data.header}</h5>
					<h2 className='text-lg font-semibold'>{truncatedTitle}</h2>
				</div>

				{/* Image Section with onClick to open the modal */}
				<div className='flex flex-col items-center col-span-4'>
					<ImageModal src={data.image} alt={truncatedTitle} width={500} height={500} className='rounded-lg border-2' />
					<h5 className="mt-1 text-[13px] text-gray-500 font-semibold">{formatTimePastTimestamp(data.timestamp)}</h5>
				</div>
			</section>

			{/* Divider Section */}
			<section className='row-span-7 flex flex-col justify-end mx-2'>
				{sections ? (
					<div className="flex flex-row justify-between items-center px-10">
						{sections.map((section, index) => (
							<React.Fragment key={index}>
								<div className="flex flex-col items-center">
									<div className="text-sm font-semibold text-gray-500 mb-1">
										{section.label}
									</div>
									<div className={`${section.className} text-xl font-extrabold text-gray-800`}>
										{section.value}
									</div>
								</div>
								{index === 0 && sections.length === 2 && (
									<div className="border-l-2 border-gray-300 h-full mx-4"></div>
								)}
							</React.Fragment>
						))}
					</div>
				) : null}

				{/* Table Section */}
				<div className="sm:p-2">
					<div className="overflow-x-auto">
						<table className="table">
							<thead>
								<tr>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(data.tableContents).map(([key, { value, className }], index) => (
									<tr key={index}>
										<td>{key}</td>
										<td className={className}>{key === "Releases In" && timeUntilRelease ? timeUntilRelease : value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

			</section>

			{/* Links Section */}
			<section className="flex flex-row justify-center rounded-b-lg w-full h-[3rem] mt-4">
				{/* eBay Sell History Button */}
				{data.ebay_link ? (
					<Link
						href={data.ebay_link}
						target="_blank"
						rel="noopener noreferrer"
						className="w-6/12 bg-houseBlue text-white text-center flex items-center justify-center hover:bg-houseHoverBlue transform transition duration-200"
					>
						<span className="font-semibold text-xs sm:text-sm">EBAY SELL HISTORY</span>
					</Link>
				) : null}
				{/* Divider */}
				<div className="border-l-2 border-white h-full"></div>
				{/* Get Deal Link */}
				<Link
					href={data.link}
					target="_blank"
					rel="noopener noreferrer" // Security attributes for external links
					className={`${data.ebay_link ? 'w-6/12' : 'w-full'} bg-houseBlue text-white text-center group flex items-center justify-center hover:bg-houseHoverBlue transform transition duration-200`}
				>
					<span className="mr-1 font-semibold text-xs sm:text-sm">GET DEAL</span>
					<span className="hidden sm:inline">
						<AnimationArrow />
					</span>
				</Link>
			</section>
		</div>
	)
}

export default Card