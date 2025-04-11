import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const ComingSoon = () => {
    return (
        <div className="flex flex-col items-center pt-20">
            <div className="w-full animate-fadeInPrimary">
                <p className={`${lato.className} text-6xl text-white text-center`}>
                    Coming <span className="bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent">Soon</span>
                </p>
            </div>
            <p className={`w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center animate-fadeInSecondary font-medium ${inter.className}`}>
                Currently Re-Building & Under Development - Stay Tuned!
            </p>
        </div>
    )
}

export default ComingSoon