import Preparing from "../components/preparing/Preparing";

export const metadata = {
    title: "Preparing Flippify Account",
    description:
        "Preparing your account",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    }
};

export default function PreparingPage() {
    return (
        <Preparing />
    );
}
