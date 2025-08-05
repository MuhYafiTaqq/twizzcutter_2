"use client";
 
import { Tabs } from "../../components/ui/tabs";
import Image from "next/image";
import React from "react";

export default function Template() {
    const linkWithGap = [
    "https://s.id/ruOjY",
    "https://s.id/LLhHl",
    "https://s.id/5Xo54",
    "https://s.id/D7YnA",
    "https://s.id/QhLfS",
  ]

  const linkWithoutGap = [
    "https://s.id/without-gap-3x1",
    "https://s.id/without-gap-3x2",
    "https://s.id/without-gap-3x3",
    "https://s.id/without-gap-3x4",
    "https://s.id/without-gap-3x5",
  ];

  const linkCarousel = [
    "https://s.id/DeH5H",
  ]

    const tabs = [
    {
      title: "With Gap",
      value: "gridwithgap",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black">
          <p>Template Grid With Gap</p>
          <div className="flex items-center justify-center mt-4 h-full w-full gap-6 mb-2">
            {/* Kiri: Mockup */}
            <div className="hidden md:block flex-1 items-center justify-center h-full w-1/3 rounded-lg">
              {/* Ganti src dengan gambar mockup Anda */}
            </div>
            {/* Kanan: Dropdown & Copy */}
            <div className="flex-1 border-2 border-neutral-700 h-full md:w-2/3 w-full rounded-lg flex flex-col items-center justify-center gap-4 p-6">
              <DropdownCopyLink link={linkWithGap} mode="with-gap" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Without Gap",
      value: "gridwithoutgap",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black">
          <p>Template Grid With Gap</p>
          <div className="flex items-center justify-center mt-4 h-full w-full gap-6 mb-2">
            {/* Kiri: Mockup */}
            <div className="hidden md:block flex-1 items-center justify-center h-full w-1/3 rounded-lg">
              {/* Ganti src dengan gambar mockup Anda */}
            </div>
            {/* Kanan: Dropdown & Copy */}
            <div className="flex-1 border-2 border-neutral-700 h-full md:w-2/3 w-full rounded-lg flex flex-col items-center justify-center gap-4 p-6">
              <DropdownCopyLink link={linkWithoutGap} mode="without-gap" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Carousel",
      value: "carousel",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black">
          <p>Template Grid With Gap</p>
          <div className="flex items-center justify-center mt-4 h-full w-full gap-6 mb-2">
            {/* Kiri: Mockup */}
            <div className="hidden md:block flex-1 items-center justify-center h-full w-1/3 rounded-lg">
              {/* Ganti src dengan gambar mockup Anda */}
            </div>
            {/* Kanan: Dropdown & Copy */}
            <div className="flex-1 border-2 border-neutral-700 h-full md:w-2/3 w-full rounded-lg flex flex-col items-center justify-center gap-4 p-6">
              <DropdownCopyLink link={linkCarousel} mode="carousel" />
            </div>
          </div>
        </div>
      ),
    }
  ];
 
  return (
    <div className="flex flex-col p-2 flex-1 h-full w-full py-10">
        <Image src="/starship.svg" alt="Logo" width={100} height={100} className="mx-auto h-1/5 w-1/5 mb-4" />
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))] font-sans tracking-tight">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                    <span className="text-2xl font-bold">Template Space</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                    <span className="text-2xl font-bold">Template Space</span>
                </div>
                </div>
        <div className="[perspective:1000px] relative b flex flex-col max-w-5xl mx-auto h-100 w-full items-start justify-start mt-5">
        <Tabs tabs={tabs} />
        </div>
    </div>
  );
}

// Tambahkan komponen DropdownCopyLink di file ini atau import jika ingin dipisah
function DropdownCopyLink({ link, mode }: { link: string[]; mode: string }) {
  const [selected, setSelected] = React.useState(1);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link[selected - 1]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-white font-semibold text-base mb-1 text-left">
        {mode === "carousel" ? "Template:" : "Pilih Ukuran Grid:"}
      </p>
      {mode !== "carousel" && (
        <select
          className="w-full p-1 rounded-full border border-gray-300 text-white text-lg px-4"
          value={selected}
          onChange={e => setSelected(Number(e.target.value))}
        >
          
            <>
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i + 1} value={i + 1} className="text-black">
                  3 x {i + 1} = {mode === "with-gap" ? "3130px" : "3110px"} x {(i + 1) * 1350}px
                </option>
              ))}
            </>
        </select>
        )}
      <div className="flex items-center gap-2 w-full rounded-full border border-gray-300">
        <button
          className="flex-1 p-2 text-white text-sm bg-neutral-700 rounded-full text-start focus:outline-none pl-4 cursor-pointer"
          onClick={() => window.open(link[selected - 1], "_blank")}
        >
          {link[selected - 1]}
        </button>
        <button
          onClick={handleCopy}
          className="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition text-sm pr-4 cursor-pointer"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}