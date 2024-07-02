import Navbar from "../../components/Navbar"
import Legal from "../../components/Legal"
import Loading from "../../../components/Loading"

import { Suspense } from "react";

export default function legal() {
    return (
        <Suspense fallback={<Loading />}>
            <div className="h-screen w-screen flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-10">
                    <Navbar />
                </div>
                <div className="mt-16 flex-1 overflow-y-auto">
                    <Legal />
                </div>
            </div>
        </Suspense>
    )
}