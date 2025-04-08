export default function HomeVideoShowcase() {
    return (
        <div className="relative w-full max-w-7xl mx-auto">
            <div className="aspect-video w-full rounded-lg overflow-hidden select-none pointer-events-none">
                <iframe
                    src="https://www.youtube.com/embed/bwlF5wHMFuE?controls=0&showinfo=0&rel=0&modestbranding=0&autoplay=1&mute=1&loop=1&playlist=bwlF5wHMFuE"
                    className="w-full h-full scale-[1.07]"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                >
                </iframe>
            </div>
        </div>
    );
}