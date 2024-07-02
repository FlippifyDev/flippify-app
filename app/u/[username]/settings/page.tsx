import Navbar from "../../components/Navbar";
import { Suspense } from "react";
import Loading from "../../../components/Loading";

export default function SettingsPage() {
    return (
    <Suspense fallback={<Loading />}>
        <div
            className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
            style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
        >
            <div className="flex flex-col min-h-screen">
                <div className="fixed top-0 left-0 right-0">
                    <Navbar />
                </div>
            </div>
        </div>
    </Suspense>
    )
}