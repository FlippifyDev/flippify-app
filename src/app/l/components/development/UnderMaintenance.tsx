import { xLink } from '@/utils/constants';
import { Lato, Inter } from 'next/font/google';
import Link from 'next/link';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const UnderMaintenance = () => {
    return (
        <div className="flex flex-col items-center pt-20 min-h-screen">
            <div className="w-full animate-fadeInPrimary">
                <p className={`${lato.className} text-6xl text-white text-center`}>
                    Under <span className="bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent">Maintenance</span>
                </p>
            </div>
            <p className={`w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center animate-fadeInSecondary font-medium ${inter.className}`}>
                We are currently under maintenance and have prevented logining in. For updates please visit <Link className='text-houseHoverBlue hover:underline' href={xLink}>here</Link>
            </p>
        </div>
    )
}

export default UnderMaintenance