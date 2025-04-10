export default function HomeVideoShowcase() {
    return (
        <div className="relative w-full max-w-7xl mx-auto p-3 border-[3px] border-white rounded-4xl bg-white/40 shadow-md">
            <div className="aspect-video w-full rounded-3xl overflow-hidden select-none pointer-events-none">
                <iframe
                    src="https://www.youtube.com/embed/VB2y7if9YfM?controls=0&showinfo=0&rel=0&modestbranding=0&autoplay=1&mute=1&loop=1&playlist=VB2y7if9YfM"
                    className="w-full h-full scale-[1.06]"
                    allow="autoplay; encrypted-media"
                >
                </iframe>
            </div>
        </div>
    );
}