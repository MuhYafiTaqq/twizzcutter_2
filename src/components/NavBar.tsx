"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    // State untuk melacak apakah tampilan saat ini adalah desktop
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Fungsi untuk memperbarui state isDesktop
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // 768px adalah breakpoint 'md' di Tailwind
    };

    // Panggil sekali saat komponen dimuat
    handleResize();

    // Tambahkan event listener untuk mendeteksi perubahan ukuran layar
    window.addEventListener('resize', handleResize);

    // Bersihkan event listener saat komponen di-unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // [] agar hanya berjalan sekali saat mount

  // Logika scrollIntoView sudah diperbaiki agar lebih konsisten
  useEffect(() => {
    // Menentukan segmen path yang benar. "/reels" -> "reels". "/" -> "cutter".
    const currentPathSegment = pathname.split("/")[1] || "cutter";
    
    // Mencari tab yang ID-nya cocok
    const activeTab = tabRefs.current.find(
      (tab) => tab?.id === `sidebar-tab-${currentPathSegment}`
    );
    
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname]);

  const NavTop = () => {
    return (
        <>
            {/* Home (Cutter) - Path: "/" */}
            <Image src={"/logo.png"} alt="logo" width={56} height={56} className="md:py-5 hidden md:block" />
            <Link
            className={`flex flex-col items-center justify-center min-w-[20%] h-full rounded-lg transition-all duration-200 ease-in-out transform
                        ${
                        pathname === "/"
                            ? "bg-white text-black scale-105 animate-[pressButton_0.3s_forwards]"
                            : "text-white hover:bg-white/15 hover:scale-105 active:scale-95"
                        }
                        md:h-15 md:w-full md:self-start
                    `}
            href={"/"}
            ref={(el) => {(tabRefs.current[5] = el)}} // Perbaikan: Index yang benar      
            id="sidebar-tab-cutter" // Perbaikan: ID yang konsisten dengan useEffect
            >
            <div
                className={`transition-transform duration-200 ease-in-out
                            ${
                                pathname === "/"
                                ? "scale-110"
                                : "hover:-translate-y-1"
                            }
                            `}
            >
                <Image
                src={`${pathname === "/" ? "/cutter-active.svg" : "/cutter.svg"}`}
                alt={`Cutter logo`}
                width={24}
                height={24}
                />
            </div>
            <h6 className="text-xs mt-0.5">Cutter</h6>
            </Link>

            {/* Reels - Path: "/reels" */}
            <Link
            className={`flex flex-col items-center justify-center min-w-[20%] h-full rounded-lg transition-all duration-200 ease-in-out transform
                        ${
                        pathname === "/reels"
                            ? "bg-white text-black scale-105 animate-[pressButton_0.3s_forwards]"
                            : "text-white hover:bg-white/15 hover:scale-105 active:scale-95"
                        }
                        md:h-15 md:w-full
                    `}
            href={"/reels"}
            ref={(el) => {(tabRefs.current[1] = el)}} // Perbaikan: Index yang benar
            id="sidebar-tab-reels" // Perbaikan: ID yang konsisten
            >
            <div
                className={`transition-transform duration-200 ease-in-out
                            ${
                                pathname === "/reels"
                                ? "scale-110"
                                : "hover:-translate-y-1"
                            }
                            `}
            >
                <Image
                src={`${pathname === "/reels" ? "/reels-active.svg" : "/reels.svg"}`}
                alt={`Reels logo`}
                width={24}
                height={24}
                />
            </div>
            <h6 className="text-xs mt-0.5">Reels</h6>
            </Link>
        </>
    )
  }

  const NavBot = () => {
    return (
        <>
             {/* FAQ - Path: "/faq" */}
            <Link
            className={`flex flex-col items-center justify-center min-w-[20%] h-full rounded-lg transition-all duration-200 ease-in-out transform
                        ${
                        pathname === "/faq"
                            ? "bg-white text-black scale-105 animate-[pressButton_0.3s_forwards]"
                            : "text-white hover:bg-white/15 hover:scale-105 active:scale-95"
                        }
                        md:h-15 md:w-full
                    `}
            href={"/faq"}
            ref={(el) => {(tabRefs.current[2] = el)}} // Perbaikan: Index yang benar
            id="sidebar-tab-faq" // Perbaikan: ID yang konsisten
            >
            <div
                className={`transition-transform duration-200 ease-in-out
                            ${
                                pathname === "/faq"
                                ? "scale-110"
                                : "hover:-translate-y-1"
                            }
                            `}
            >
                <Image
                src={`${pathname === "/faq" ? "/faq-active.svg" : "/faq.svg"}`}
                alt={`FAQ logo`}
                width={24}
                height={24}
                />
            </div>
            <h6 className="text-xs mt-0.5">FAQ</h6>
            </Link>
            
            {/* Template - Path: "/template" */}
            <Link
            className={`flex flex-col items-center justify-center min-w-[20%] h-full rounded-lg transition-all duration-200 ease-in-out transform
                        ${
                        pathname === "/template"
                            ? "bg-white text-black scale-105 animate-[pressButton_0.3s_forwards]"
                            : "text-white hover:bg-white/15 hover:scale-105 active:scale-95"
                        }
                        md:h-15 md:w-full
                    `}
            href={"/template"}
            ref={(el) => {(tabRefs.current[3] = el)}}
            id="sidebar-tab-template"
            >
            <div
                className={`transition-transform duration-200 ease-in-out
                            ${
                                pathname === "/template"
                                ? "scale-110"
                                : "hover:-translate-y-1"
                            }
                            `}
            >
                <Image
                src={`${pathname === "/template" ? "/template-active.svg" : "/template.svg"}`}
                alt={`Template logo`}
                width={24}
                height={24}
                />
            </div>
            <h6 className="text-xs mt-0.5">Template</h6>
            </Link>

            {/* Donate - Path: "/donate" */}
            <Link
            className={`flex flex-col items-center justify-center min-w-[20%] h-full rounded-lg transition-all duration-200 ease-in-out transform
                        ${
                        pathname === "/donate"
                            ? "bg-white text-black scale-105 animate-[pressButton_0.3s_forwards]"
                            : "text-white hover:bg-white/15 hover:scale-105 active:scale-95"
                        }
                        md:h-15 md:w-full
                    `}
            href={"/donate"}
            ref={(el) => {(tabRefs.current[4] = el)}}
            id="sidebar-tab-donate"
            >
            <div
                className={`transition-transform duration-200 ease-in-out
                            ${
                                pathname === "/donate"
                                ? "scale-110"
                                : "hover:-translate-y-1"
                            }
                            `}
            >
                <Image
                src={`${pathname === "/donate" ? "/donate-active.svg" : "/donate.svg"}`}
                alt={`Donate logo`}
                width={24}
                height={24}
                />
            </div>
            <h6 className="text-xs mt-0.5">Donate</h6>
            </Link>
            
            {/* About - Path: "/about" */}
            <Link
            className={`flex flex-col items-center justify-center min-w-[20%] h-full rounded-lg transition-all duration-200 ease-in-out transform
                        ${
                        pathname === "/about"
                            ? "bg-white text-black scale-105 animate-[pressButton_0.3s_forwards]"
                            : "text-white hover:bg-white/15 hover:scale-105 active:scale-95"
                        }
                        md:h-15 md:w-full
                    `}
            href={"/about"}
            ref={(el) => {(tabRefs.current[5] = el)}}
            id="sidebar-tab-about"
            >
            <div
                className={`transition-transform duration-200 ease-in-out
                            ${
                                pathname === "/about"
                                ? "scale-110"
                                : "hover:-translate-y-1"
                            }
                            `}
            >
                <Image
                className={`${pathname === "/about" ? "fill-black" : "color-white"}`}
                src={`${pathname === "/about" ? "/about-active.svg" : "/about.svg"}`}
                alt={`About logo`}
                width={24}
                height={24}
                />
            </div>
            <h6 className="text-xs mt-0.5">About</h6>
            </Link>
        </>
    )
  }

  return (
    <nav className="flex fixed bottom-0 h-16 w-full items-center justify-center bg-black py-1 md:left-0 md:w-24 md:h-full md:py-0">
      <div className="flex w-full h-full overflow-x-auto items-center justify-start px-4 hide-scrollbar md:flex-col md:px-2 md:py-2 md:justify-between">

        {isDesktop ? (
            <>
            <div className="w-full gap-1 flex flex-col items-center justify-center">
                <NavTop />
            </div>
            <div className="w-full gap-1 flex flex-col items-center justify-center">
                <NavBot />
            </div>
            
            </>
        ) : (
            <>
                <NavTop />
                <NavBot />
            </>
        )}
           
      </div>
    </nav>
  );
}