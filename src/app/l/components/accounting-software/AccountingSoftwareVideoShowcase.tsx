import React from 'react'

const AccountingSoftwareVideoShowcase = () => {
    return (
        <div className="relative w-full max-w-7xl mx-auto p-3 border-[3px] border-white rounded-4xl bg-white shadow-md">
            <div className="aspect-video w-full rounded-3xl overflow-hidden select-none pointer-events-none">
                <video
                    src="https://flippify.b-cdn.net/OptimisedLandingDemo.mp4"
                    className="w-full h-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                >
                    <source src="https://flippify.b-cdn.net/OptimisedLandingDemo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    )
}

export default AccountingSoftwareVideoShowcase