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
            <div className="overflow-hidden rounded-lg aspect-video">
                <iframe
                    src="https://www.youtube.com/embed/bwlF5wHMFuE?autoplay=1&loop=1&playlist=bwlF5wHMFuE&mute=1"
                    title="Landing Dashboard Showcase"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full object-cover"
                >
                </iframe>
            </div>
        </div>
    );
}