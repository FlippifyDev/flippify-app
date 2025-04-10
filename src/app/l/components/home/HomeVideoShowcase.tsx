export default function HomeVideoShowcase() {
    return (
        <div className="relative w-full max-w-7xl mx-auto">
            <div className="aspect-video w-full rounded-lg overflow-hidden select-none pointer-events-none">
                <iframe
                    src="https://flippify.b-cdn.net/OptimisedLandingDemo.mp4"
                    className="w-full h-full scale-[1.07]"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                >
                </iframe>
            </div>
        </div>
    );
}