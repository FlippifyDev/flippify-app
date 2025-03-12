import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from './HomeGetEarlyAccess';
import HomeAbout from './HomeAbout';
import HomeMockupPhone from './HomeMockupPhone';
import HomeMockupBrowser from './HomeMockupBrowser';
import HomeShowcase from './HomeShowcase';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeContent = ({ className = '' }) => {
	return (
		<div className={`home-details-container ${className}`}>
			<div className='flex flex-col items-center'>
				<div className="w-11/12 mt-3 lg:mt-10 md:w-4/5 lg:w-3/5 xl:w-2/5">
					<p className={`${lato.className} text-6xl text-white text-center`}>
						Efficient Reselling using <span className="bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent">Software</span>
					</p>
				</div>
				<p className='w-11/12 sm:w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center'>
					Handling everything so you don&apos;t have to, eBay & Amazon store automation & tracking in all areas.
				</p>

				<HomeGetEarlyAccess />

				<div className="pt-[90px] lg:pt-[150px]" />
				<div className="flex flex-col lg:flex-row my-4 md:my-11 mx-2 md:mx-6 py-8 sm:py-2 md:py-0 md:pl-4 bg-white bg-opacity-85 border border-gray-300 rounded-3xl shadow-md overflow-hidden">
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
