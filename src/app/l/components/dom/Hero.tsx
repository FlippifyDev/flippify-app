import Image from 'next/image';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

interface HeroProps {
    text?: { text: string, isGradient?: boolean }[];
    description: string;
    image: string;
    imageAlt: string;
    button?: React.ReactNode;
    titleClassName?: string;
}

const Hero: React.FC<HeroProps> = ({ text, description, image, imageAlt, button, titleClassName }) => {
    const renderTitle = () => {
        if (!text || text.length === 0) return null;

        return text.map((segment, index) => {
            if (segment.isGradient) {
                return (
                    <span
                        key={index}
                        className={`${lato.className} from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent`}
                    >
                        {segment.text}{" "}
                    </span>
                );
            } else {
                return (
                    <span
                        key={index}
                        className={`${inter.className} text-white font-bold`}
                    >
                        {segment.text}{" "}
                    </span>
                );
            }
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Side: Header, Subtitle, and Button */}
            <div className={`w-full lg:w-1/2 ${titleClassName}`}>
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] text-4xl sm:text-5xl md:text-6xl text-left animate-fadeInPrimary">
                    <p className="mb-2">
                        {renderTitle()}
                    </p>
                </div>
                <p className="mt-6 sm:mt-8 md:mt-10 lg:mt-[30px] xl:mt-[35px] mb-8 pb-1 pt-2 text-gray-300 text-base sm:text-lg md:text-xl text-left animate-fadeInSecondary">
                    {description}
                </p>
                {button ? button : null}
            </div>
            {/* Right Side: Image */}
            <div className="w-full lg:w-1/3 hidden lg:block">
                <Image
                    src={image}
                    alt={imageAlt}
                    className="w-full h-auto mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] animate-fadeInSecondary"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    );
};

export default Hero;