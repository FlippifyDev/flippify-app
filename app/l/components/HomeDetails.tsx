import PhoneMockup from '../components/PhoneMockup'

const HomeDetails = ({ className = '' }) => {
    return (
        <div className={`home-details-container ${className}`}>    
            <div className='flex flex-col items-center mt-10'>
                <p className='mb-8 text-5xl font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent'>Flippify<a className='mb-8 text-white text-5xl font-bold'> Made Easy.</a></p>
                <p className='mb-8 text-greyText text-lg'>Fast-track your profits with our lightning-quick deal bots, from lego to sneakers.</p>
                <PhoneMockup />
                <PhoneMockup />
            </div>
        </div>
    );
}

export default HomeDetails;