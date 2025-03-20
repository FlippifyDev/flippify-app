import { Lato, Inter } from 'next/font/google';
import HomeGetAccess from './HomeGetAccess';
import HomeAbout from './HomeAbout';
import HomeMockupPhone from './HomeMockupPhone';
import HomeMockupBrowser from './HomeMockupBrowser';
import HomeShowcase from './HomeShowcase';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const HomeContent = ({ className = '' }) => {
	return (
		<div className={`home-details-container ${className}`}>
			<div className='flex flex-col items-center'>
				<div className="w-[90%] mt-3 lg:mt-10 md:w-[80%] lg:w-[60%] xl:w-[30%] animate-fadeInPrimary">
					<p className={`${lato.className} text-6xl text-white text-center`}>
						<span className="bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent">Automated </span>Inventory & Financial Tracking
					</p>
				</div>
				<p className='w-11/12 sm:w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center animate-fadeInSecondary'>
                    Effortlessly manage your eBay listings - from creation to optimization and pricing, with automated updates and performance tracking.
				</p>

				<HomeGetAccess />

				<div className="pt-[90px] lg:pt-[150px]" />
				<div className="flex flex-col lg:flex-row my-4 md:my-11 mx-2 md:mx-6 py-8 sm:py-2 md:py-0 md:pl-4 bg-white bg-opacity-85 border border-gray-300 rounded-3xl shadow-md overflow-hidden animate-fadeInPrimary">
					<div className="lg:w-1/3">
						<HomeAbout />
					</div>
					<div className="lg:w-2/3">
						<HomeShowcase />
					</div>
				</div>

				<HomeMockupPhone />
				<HomeMockupBrowser />
			</div>
		</div>
	);
};

export default HomeContent;
