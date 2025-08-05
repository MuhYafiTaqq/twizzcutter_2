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
      <Image
        src="/starship.svg"
        alt="bg"
        width={500}
        height={500}
        className="h-45 w-45 mb-4"
      />
      <div
        className={`relative h-35 w-75 md:w-110 md:h-50 rounded-3xl border-2 border-dashed text-center ${
          isDragging
            ? "border-blue-400 bg-blue-900/50"
            : "border-black/40 bg-neutral-700/50"
        } flex flex-col justify-center items-center transition-all duration-300
                            hover:border-blue-400 hover:bg-blue-900/50 hover:cursor-pointer
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
