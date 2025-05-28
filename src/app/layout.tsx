import "@/styles/globals.css";
import "@/styles/user-sidebar.css"
import { Inter } from "next/font/google";
import Providers from "./providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="!scroll-smooth">
            <head>
                <meta
                    name="google-site-verification"
                    content="qTJ7i7h8-QZNpcGtA9piO5KO4Q-1xdjHsqjLpIslIxo"
                />
            </head>
            <body className={`${inter.className} scrollbar-hide`}>
                <Providers>
                    <ServiceWorkerRegister />
                    {children}
                </Providers>
            </body>
        </html>
    );
}