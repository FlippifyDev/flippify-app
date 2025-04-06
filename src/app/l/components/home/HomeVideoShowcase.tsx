import { useRef, useEffect } from "react";

export default function HomeVideoShowcase() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Function to play the video
        const playVideo = () => {
            video.play().catch((err) => console.error("Video playback failed:", err));
        };

        // Attempt to play the video when the component mounts
        playVideo();

        // Handle tab visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                playVideo(); // Resume playback when the tab is visible again
            }
        };

        // Add event listener for visibility changes
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <div className="relative w-full max-w-7xl mx-auto">
            <div className="relative w-full overflow-hidden rounded-lg aspect-video z-0">
                <video
                    ref={videoRef}
                    src="/optimized.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/DashboardVideoPreview.jpg"
                    className="w-full h-full object-cover rounded-lg"
                >
                    <source src="/optimized.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}