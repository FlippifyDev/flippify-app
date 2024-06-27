import PhoneMockup from '../components/PhoneMockup'

const HomeDetails = () => {
    return (
        <div className='flex flex-col items-center mt-10'>
            <p className='mb-8 text-black text-5xl font-bold'>Flipping Made Easy.</p>
            <p className='mb-8 text-greyText text-lg'>Fast-track your profits with our lightning-quick deal bots, from lego to sneakers.</p>
            <PhoneMockup />
        </div>
    );
}

export default HomeDetails;