"use client";

import { useEffect, useState } from "react";
import Input from "@/components/home/input";
import Settings from "@/components/home/settings";
import Result from "@/components/home/result";
import Image from "next/image";

import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../components/ui/animated-modal";

export default function Home() {
  // Perbaikan: Definisikan tipe state untuk image
  const [image, setImage] = useState<string | null>(null);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);

  useEffect(() => {
    if (image) {
      setImage(image);
    }
  }, [image]);

  return (
      <div className="flex flex-col px-2 py-2 flex-1 h-full">
        {/* ... Bagian Promosi ... */}
        {croppedImages.length === 0 && (
          <div className="flex-none">
              <Modal>
            <h1 className="text-black text-center text-sm mb-2">
              Have some problem?
            <ModalTrigger className="p-0 ml-1 cursor-pointer">
              <span className="text-blue-800 underline">join our community</span>
            </ModalTrigger>
            </h1>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center pb-4 border-b border-neutral-700">
              Join our {" "}
              <span className="px-1 py-0.5 rounded-md bg-neutral-800 border-neutral-700 border">
                community
              </span>{" "}
              now! ✈️
            </h4>
            
            <div className="flex flex-col items-center justify-center w-full mt-8">
              <button className="p-5 flex items-start justify-start mx-auto bg-neutral-800 border-neutral-700 border w-1/2 rounded-2xl hover:bg-neutral-700 transition-colors duration-300" onClick={() => window.open('https://chat.whatsapp.com/JAXMVJAdtZWKZI41ioOKLW', '_blank')}>
                <Image
                  src="/wa.png"
                  alt="WhatsApp"
                  width={40}
                  height={40}
                />
                <h6 className="text-white ml-4">Join Group WhatsApps Comunity</h6>
              </button>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
            
          </div>
        )}

        <div className="flex grow">
          {image && croppedImages.length === 0 ? (
            <Settings images={image} onImageChange={setImage} onCroppedImages={setCroppedImages} />
          ) : croppedImages.length > 0 ? (
            <Result croppedImages={croppedImages} onBack={() => setCroppedImages([])} onRestart={() => {setCroppedImages([]); setImage(null)}} />
          ) : (
            <div className="flex md:flex-1 flex-col md:items-center justify-center md:flex-row">
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
                  The best platform to cut your images, 
                  <Highlight className="text-black">
                    twizzcutter.com
                  </Highlight>
                </motion.h1>
              </HeroHighlight>
              <div className="my-25 md:py-0 md:px-30">
                <Input onImageChange={setImage} />
              </div>
            </div>
          )}
        </div>

        {!image && (
          <div className="flex-none">
            <p className="text-xs text-black text-center">
              by continuing, you agree to terms and ethics of use
            </p>
          </div>
        )}
      </div>
  );
}
