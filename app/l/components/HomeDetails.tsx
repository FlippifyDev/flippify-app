import PhoneMockup from '../components/PhoneMockup'
import Footer from'../components/Footer'

const HomeDetails = ({ className = '' }) => {
    return (
        <div className={`home-details-container ${className}`}>    
            <div className='flex flex-col items-center mt-10'>
                <p className='mb-8 text-5xl font-bold from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1'>Flipping<a className='mb-8 text-white text-5xl font-bold'> Made Easy.</a></p>
                <p className='mb-8 text-greyText text-lg'>Fast-track your profits with our lightning-quick deal bots, from lego to sneakers.</p>
                <PhoneMockup />
                <PhoneMockup />
                <Footer />
            </div>
        </div>
    );
}

export default HomeDetails;