import Plans from "../../components/Plans"
import Navbar from "../../components/Navbar"
import Loading from "../../../components/Loading"
import { Suspense } from "react";


export default function PlansPage() {
    return (
        <Suspense fallback={<Loading />}>
            <div
            className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
            style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
            >
                <div className="h-screen w-screen flex flex-col">
                    <div className="fixed top-0 left-0 right-0 z-10">
                        <Navbar />
                    </div>
                    <div className="mt-16 flex-1 overflow-y-auto">
                        <Plans />
                    </div>
                </div>
            </div>
        </Suspense>
    )
}