import Image from "next/image";
import { useState } from "react";

export default function Result({croppedImages, onBack, onRestart}: {croppedImages: string[], onBack: () => void, onRestart: () => void}) {
    const [isCopied, setIsCopied] = useState(false);
    const [textToCopy] = useState('085174446002');

    const handleCopyClick = () => {
        // Salin teks ke clipboard
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Beri umpan balik bahwa teks berhasil disalin
                setIsCopied(true);
                // Reset status setelah 2 detik
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => {
                console.error('Gagal menyalin teks: ', err);
            });
    };

    return (
        <div className="overflow-y-auto md:flex md:px-10 md:gap-10 md:overflow-hidden md:py-5 md:h-dvh ">
            <div className="flex flex-col justify-center items-center mt-10 md:mt-0 md:flex-1">
                <Image src={"/starship.svg"} alt="Starship Image" width={200} height={200} className="self-center" />
                <div className="mt-4">
                    <h6 className="text-black text-center font-bold text-2xl">Here The Result!</h6>
                    <p className="text-black/75 text-sm text-center">You can download the cropped images below</p>
                </div>
                <div className="mt-4 flex gap-2 w-full justify-center">
                    <button className="bg-black text-white px-4 py-2 rounded-full w-2/5" onClick={onRestart}>Restart</button>
                    <button className="bg-white text-black border px-4 py-2 rounded-full w-2/5" onClick={onBack}>Back</button>
                </div>

                <div className="bg-black p-4 rounded-xl w-full mt-4">
                    <p className="text-white text-justify text-xs mb-4">Donate for web development and maintenance, thank you all, hopefully useful!!!</p>
                    <div className="flex gap-1 items-center">
                        <Image src={"/gopay.png"} alt="gopay logo" width={50} height={50} className="rounded-lg" />
                        <Image src={"/spay.png"} alt="spay logo" width={50} height={50} className="rounded-lg" />
                        <Image src={"/dana.png"} alt="dana logo" width={50} height={50} className="rounded-lg" />
                    </div>
                    <div className="border border-white mt-4 h-10 rounded-lg flex items-center justify-between overflow-hidden">
                        <p className="text-white pl-4">085174446002</p>
                        <button
                            className={`flex items-center justify-center gap-2 h-full px-4 text-white font-bold transition-all duration-300
                                ${isCopied ? 'bg-green-600' : 'bg-gray-800 group-hover:bg-gray-900'}
                            `}
                            onClick={handleCopyClick}
                        >
                            {isCopied ? (
                                <>
                                    <span>Tersalin!</span>
                                </>
                            ) : (
                                <>
                                <Image src={"/Copy.svg"} alt="copy icon" width={20} height={20} />
                                    <span>Salin</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="w-full flex justify-end">
                        <button className="bg-white text-black font-bold border px-4 py-1.5 rounded-full w-2/5 mt-6 flex justify-center items-center gap-2">
                            More Info
                            <Image src={"/ArrowRight.svg"} alt="arrow icon" width={20} height={20} className="invert" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1 p-4 bg-black/30 rounded-xl border-2 border-black/75 border-dashed mt-8 md:mt-0 mb-4 md:mb-0 md:flex-1 md:overflow-y-auto">
                {croppedImages.map((image, index) => (
                    <div key={index} className="flex flex-col items-center relative">
                        <Image
                            src={image}
                            alt={`Cropped Image ${index}`}
                            width={200}
                            height={200}
                            className="border h-full w-full border-black"
                        />
                        <a href={image} download={`cropped-${index + 1}.png`} className="bg-blue-500 right-2 top-0 absolute text-white px-2 py-1 rounded mt-2">
                            <Image src={"/Download.svg"} alt="download icon" width={20} height={20} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}