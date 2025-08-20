import { useRef, useState } from "react";
import Image from "next/image";

export default function Input({onImageChange}: {onImageChange: (image: string) => void}) {
  // Perbaikan: Definisikan tipe state untuk image
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Perbaikan: Tambahkan tipe untuk parameter 'file'
  const handleFile = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imageData = reader.result;

        // Perbaikan: Pengecekan tipe imageData
        if (typeof imageData === "string") {
          onImageChange(imageData);
        }
      };
    }
  };

  // Perbaikan: Tambahkan tipe untuk event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Perbaikan: Tambahkan tipe untuk event drag
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Perbaikan: Tambahkan tipe untuk event drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2 justify-center items-center">
      <div
        className={`relative h-80 w-65 md:w-110 md:h-150 rounded-3xl border-3 text-center ${
          isDragging
            ? "border-blue-400 bg-black/50"
            : "border-black/40"
        } flex flex-col justify-center items-center transition-all duration-300
                            hover:border-blue-400 hover:bg-black/10 hover:cursor-pointer
                            `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          // Perbaikan: Tambahkan pengecekan null
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {/* Perbaikan: Ganti imgDocument dengan path string */}
        <Image
          src="/reels-besar.svg"
          alt="Document icon"
          width={50}
          height={50}
          className="h-25 w-25 md:w-50 md:h-50 md:mb-7 mb-4 absolute md:-top-20 md:-left-20 -top-10 -left-10"
        />
        <Image
          src="/file-drop.svg"
          alt="Document icon"
          width={50}
          height={50}
          className="h-8 w-8 md:w-13 md:mb-7 mb-4"
        />
        <h6 className="text-black md:text-xl text-sm font-bold mb-1">
          {isDragging ? "Drop the file here" : "Drag or click to select a file"}
        </h6>
        <p className="text-black/50 md:text-md text-xs">
          Supported format: PNG, JPG, JPEG
        </p>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          id="inputImg"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
