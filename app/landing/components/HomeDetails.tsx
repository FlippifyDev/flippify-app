import PhoneMockup from '../components/PhoneMockup'

const HomeDetails = () => {
    return (
        <div className='flex flex-col items-center mt-10'>
            <p className='mb-8'>Recieve insightful information on current products</p>
            <PhoneMockup />
        </div>
    );
}

export default HomeDetails;