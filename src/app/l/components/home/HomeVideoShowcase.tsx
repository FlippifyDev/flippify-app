"use client";

import { useEffect, useRef } from "react";

export default function HomeVideoShowcase() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => console.error("Video playback failed:", err));
        }
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-lg  aspect-video">
                <video
                    ref={videoRef}
                    src="/LandingDashboardShowcase.mp4"
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    autoPlay
                />
            </div>
        </div>
    );
}