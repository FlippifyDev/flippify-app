import PhoneMockup from './PhoneMockup'
import Carousel from './Carousel';

const HomeContent = ({ className = '' }) => {
    return (
        <div className={`home-details-container ${className}`}>    
            <div className='flex flex-col items-center mt-10 space-y-8'>
                <p className='mb-8 text-5xl font-bold from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1'>Flipping<a className='mb-8 text-white text-5xl font-bold'> Made Easy.</a></p>
                <p className='mb-8 text-greyText text-lg'>Fast-track your profits with our lightning-quick deal bots, from lego to sneakers.</p>
                <div className='flex flex-col items-center space-y-8'>
                    <PhoneMockup />
                    <Carousel />
                </div>
            </div>
        </div>
    );
}

export default HomeContent;