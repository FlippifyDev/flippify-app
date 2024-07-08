import Image from 'next/image'

const PhoneMockup = () => {
    return (
        <div className="mockup-phone w-80">
            <div className="camera"></div> 
            <div className="display">
                <figure><Image src="https://i.ibb.co/wgp29vn/phone-mockup-image.jpg" alt="Phone Mockup" loading="lazy" width={800} height={500}/></figure>
            </div>
        </div>
    );
}

export default PhoneMockup