import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from '../components/NavBar'; // Import komponen Nav Anda

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Twizz Cutter",
    description: "Twizz Cutter is a tool to cut out twizzles from images",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="flex flex-col items-center justify-items-center h-dvh pb-16 pt-1 px-1 bg-black md:pl-24 md:pr-2 md:py-2">
                    <main className="flex flex-col flex-grow w-full bg-white rounded-2xl overflow-y-auto">
                        {/* children akan menampilkan konten dari setiap halaman */}
                        {children}
                    </main>    
                    <Nav />
                </div>
            </body>
        </html>
    );
}