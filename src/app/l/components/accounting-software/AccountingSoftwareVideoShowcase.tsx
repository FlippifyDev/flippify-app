import React from 'react'

const AccountingSoftwareVideoShowcase = () => {
    return (
        <div className="relative w-full max-w-6.5xl mx-auto">
            <div className="aspect-video w-full border-2 bg-gray-100/80 shadow-md border-white p-2 rounded-4xl overflow-hidden select-none pointer-events-none">
                <video
                    src="https://flippify.b-cdn.net/OptimisedLandingDemo.mp4"
                    className="w-full h-full rounded-3xl object-fill"
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