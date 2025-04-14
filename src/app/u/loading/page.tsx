// Local Imports
import { SignOutLink } from "../../components/SignOutButton";
import LoadingAnimation from "../components/dom/ui/LoadingAnimation";


export const metadata = {
    title: "Loading Flippify Account",
    description:
        "Loading your account",
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

export default function LoadingPage() {
    return (
        <div className="w-full h-screen bg flex flex-col justify-center items-center">
            <div className="">
                <LoadingAnimation text="" type="stack-loader" />
            </div>
            <div className="mt-4">
                <SignOutLink />
            </div>
        </div>
    );
}