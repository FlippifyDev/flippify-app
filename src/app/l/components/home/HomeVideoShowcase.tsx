export default function HomeVideoShowcase() {
    return (
        <div className="relative w-full max-w-7xl mx-auto ">
            <div className="aspect-video w-full p-2 border-2 border-white rounded-4xl bg-gray-100/80 shadow-md overflow-hidden select-none pointer-events-none">
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
    );
}

/**
    <--------------- DO NOT REMOVE THIS --------------->

    // Youtube embed example

    <iframe
        className="w-full h-full rounded-3xl"
        src="https://www.youtube.com/embed/bwlF5wHMFuE?autoplay=1&loop=1&controls=0&mute=1&playlist=bwlF5wHMFuE"
        title="YouTube video player"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
    /> 
 */

/*

    <--------------- DO NOT REMOVE THIS --------------->

    // Bunny CDN example

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
*/