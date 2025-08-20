"use client";

import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import Input from "./components/input";

import Settings from "./components/settings";
import { useState } from "react";

export default function Reels() {
  // Perbaikan: Definisikan tipe state untuk image
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="flex-1 justify-center items-center flex">
      <div className="grid md:grid-cols-20 gap-4 md:p-6 p-2 h-full w-full grid-rows-20 md:grid-rows-1">
        {!image ? (
          <>
            <div className="md:col-span-13 row-span-10 flex md:flex-1 flex-col md:items-center justify-center md:flex-row ">
              <HeroHighlight className="md:flex-1">
                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                  className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
                >
                  Let's create and cut your cover reels,
                  <Highlight className="text-black">twizzcutter.com</Highlight>
                </motion.h1>
              </HeroHighlight>
            </div>
            <div className="md:col-span-7 row-span-10 flex">
              <Input onImageChange={setImage} />
            </div>
          </>
        ) : (
          <Settings images={image} setImages={setImage} />
        )}
      </div>
    </div>
  );
}
