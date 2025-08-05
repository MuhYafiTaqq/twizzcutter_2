import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Settings({images, onImageChange, onCroppedImages } : { images : string, onImageChange: (image: string) => void, onCroppedImages: (images: string[]) => void}) {
    const [cropMode, setCropMode] = useState("grid");
    const [gridMode, setGridMode] = useState("withgap");
    const [gridCols, setGridCols] = useState(1);
    const [gridRows, setGridRows] = useState(1);

    const handleAddColumn = () => setGridCols(gridCols + 1);
    const handleRemoveColumn = () => gridCols > 1 && setGridCols(gridCols - 1);
    const handleAddRow = () => setGridRows(gridRows + 1);
    const handleRemoveRow = () => gridRows > 1 && setGridRows(gridRows - 1);

    const prevRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [loading, setLoading] = useState(false);
    
    // Fungsi untuk mereset grid
    const resetGrid = () => {
        if (cropMode === "grid") {
            setGridCols(1);
        }
        if (cropMode === "carousel") {
            setGridRows(1);
        }
    };
    
    // Fungsi untuk menggambar grid pada canvas
    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // 🔹 Inisialisasi variabel dengan nilai default untuk mencegah 'undefined'
    let cellWidth = 0, cellHeight = 0;
    let startX = 0, startY = 0;
    let totalCols = 0, totalRows = 0;

    // 🔹 Logika perhitungan berdasarkan mode crop
    if (cropMode === "grid") {
        let aspectRatio;
        if(gridMode === "withgap") {
            aspectRatio = 0.4313099041533546;
        } else {
            aspectRatio = 0.4340836012861736;
        }
            cellWidth = canvas.width / 3;
            cellHeight = cellWidth * 3 * aspectRatio;
    
            let totalWidth = cellWidth * 3;
            let totalHeight = cellHeight * gridRows;
    
            // Jika total tinggi lebih besar dari canvas, sesuaikan ukuran grid
            if (totalHeight > canvas.height) {
                cellHeight = canvas.height / gridRows;
                cellWidth = cellHeight / (3 * aspectRatio);
            }
    
            totalWidth = cellWidth * 3;
            totalHeight = cellHeight * gridRows;
    
            // Pusatkan grid di tengah-tengah canvas
            if (totalWidth < canvas.width) {
                startX = (canvas.width - totalWidth) / 2;
            }
            if (totalHeight < canvas.height) {
                startY = (canvas.height - totalHeight) / 2;
            }

            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
        
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < gridRows; j++) {
                    const x = startX + i * cellWidth;
                    const y = startY + j * cellHeight;
                    ctx.strokeRect(x, y, cellWidth, cellHeight);
                }
            }
            return 1;
    }
    else if (cropMode === "carousel") {
        totalCols = gridCols;
        totalRows = 1; // Carousel selalu memiliki 1 baris
        
        // Asumsi rasio 4:5 (bisa diubah)
        const aspectRatio = 4 / 5;
        cellWidth = canvas.width / totalCols;
        cellHeight = cellWidth / aspectRatio;

        // Jika tinggi sel melebihi canvas, sesuaikan
        if (cellHeight > canvas.height) {
            cellHeight = canvas.height;
            cellWidth = cellHeight * aspectRatio;
        }

        startX = (canvas.width - cellWidth * totalCols) / 2;
        startY = (canvas.height - cellHeight * totalRows) / 2;
    }
    else if (cropMode === "custom") {
        totalCols = gridCols;
        totalRows = gridRows;
        
        cellWidth = canvas.width / totalCols;
        cellHeight = canvas.height / totalRows;

        // Pusatkan grid
        startX = (canvas.width - cellWidth * totalCols) / 2;
        startY = (canvas.height - cellHeight * totalRows) / 2;
    }
    
    // 🔹 Bagian Gambar Grid (Tidak ada pengulangan lagi)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    for (let i = 0; i < totalCols; i++) {
        for (let j = 0; j < totalRows; j++) {
            const x = startX + i * cellWidth;
            const y = startY + j * cellHeight;
            ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
    }
};

    // Fungsi untuk memperbarui canvas dengan gambar
    const updateCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const img = new window.Image();
        img.src = images;
        img.onload = function () {
            const aspectRatio = img.width / img.height;
            let adjustedWidth = width;
            let adjustedHeight = adjustedWidth / aspectRatio;

            if (adjustedHeight > height) {
                adjustedHeight = height;
                adjustedWidth = adjustedHeight * aspectRatio;
            }

            canvas.width = adjustedWidth;
            canvas.height = adjustedHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawGrid(ctx, canvas);
        };
    };

    const handleCrop = () => {
        setLoading(true);

        const img = new window.Image();
        img.src = images;
        img.onload = function () {
            const originalWidth = img.width;
            const originalHeight = img.height;
            const croppedData = [];

            if (cropMode === "grid") {
              const height = 1350
              let aspectRatio, width, crop;
                if(gridMode === "withgap") {
                  aspectRatio = 0.4313099041533546;
                  width = 3130;
                  crop = [0, 1025, 2050]
                } else {
                  aspectRatio = 0.4340836012861736;
                  width = 3110;
                  crop = [0, 1015, 2030]
                }
                let startX = 0, startY = 0;
            
                // 🔹 Hitung ukuran grid berdasarkan gambar asli
                let gridCellWidth = originalWidth / gridCols;
                let gridCellHeight = gridCellWidth * aspectRatio;
            
                let totalGridWidth = gridCellWidth * gridCols;
                let totalGridHeight = gridCellHeight * gridRows;
            
                if (totalGridHeight > originalHeight) {
                    gridCellHeight = originalHeight / gridRows;
                    gridCellWidth = gridCellHeight / aspectRatio;
                }
            
                totalGridWidth = gridCellWidth * gridCols;
                totalGridHeight = gridCellHeight * gridRows;
            
                // 🔹 Pusatkan grid dalam gambar asli
                if (totalGridWidth < originalWidth) {
                    startX = (originalWidth - totalGridWidth) / 2;
                }
                if (totalGridHeight < originalHeight) {
                    startY = (originalHeight - totalGridHeight) / 2;
                }
            
                for (let j = 0; j < gridRows; j++) {
                    for (let i = 0; i < gridCols; i++) {
                        const cropCanvas = document.createElement("canvas");
                        const cropCtx = cropCanvas?.getContext("2d");
            
                        // 🔹 Hitung posisi crop berdasarkan gambar asli
                        const cropX = startX + i * gridCellWidth;
                        const cropY = startY + j * gridCellHeight;
            
                        cropCanvas.width = width; // Ukuran output tetap
                        cropCanvas.height = height;
            
                        cropCtx?.drawImage(
                            img,
                            cropX, cropY, gridCellWidth, gridCellHeight, // **Crop area di gambar asli**
                            0, 0, width, height // **Resize hasil crop ke 3312x1440**
                        );
            
                        // 🔹 **Bagi hasil crop menjadi 3 bagian**
                        for (let k = 0; k < 3; k++) {
                            const cropCanvas2 = document.createElement("canvas");
                            const cropCtx2 = cropCanvas2.getContext("2d");
            
                            cropCanvas2.width = 1080; // Ukuran output tetap
                            cropCanvas2.height = 1350;
            
                            cropCtx2?.drawImage(
                                cropCanvas,
                                crop[k], 0, 1080, 1350, // **Crop area di hasil grid**
                                0, 0, 1080, 1350 // **Resize hasil crop ke 1080x1350**
                            );
            
                            croppedData.push(cropCanvas2.toDataURL("image/png"));
                        }
                    }
                }
            }
            else if (cropMode === "custom") {
                // MODE CUSTOM: Memotong dengan grid
                const cellWidth = originalWidth / gridCols;
                const cellHeight = originalHeight / gridRows;

                for (let j = 0; j < gridRows; j++) {
                    for (let i = 0; i < gridCols; i++) {
                        const cropCanvas = document.createElement("canvas");
                        const cropCtx = cropCanvas?.getContext("2d");
                        cropCanvas.width = cellWidth;
                        cropCanvas.height = cellHeight;

                        cropCtx?.drawImage(
                            img,
                            i * cellWidth, j * cellHeight,
                            cellWidth, cellHeight,
                            0, 0, cellWidth, cellHeight
                        );

                        croppedData.push(cropCanvas.toDataURL("image/png"));
                    }
                }
            }
            else if (cropMode === "carousel") {
                // Asumsi rasio 4:5 (bisa diubah)
                const aspectRatio = 4 / 5;
                let targetWidth = originalWidth / gridCols;
                let targetHeight = targetWidth / aspectRatio;

                // Jika tinggi sel melebihi canvas, sesuaikan
                if (targetHeight > originalHeight) {
                    targetHeight = originalHeight;
                    targetWidth = targetHeight * aspectRatio;
                }

                const startX = (originalWidth - targetWidth * gridCols) / 2;
                const startY = (originalHeight - targetHeight) / 2;

                for (let i = 0; i < gridCols; i++) {
                    const cropCanvas = document.createElement("canvas");
                    const cropCtx = cropCanvas?.getContext("2d");
                    
                    cropCanvas.width = 1080; // Ukuran output tetap 4:5
                    cropCanvas.height = 1350;

                    const cropX = startX + i * targetWidth; // Mulai crop dari tengah secara horizontal
                    const cropY = startY; // **Fix: Crop benar-benar dari tengah vertikal**

                    cropCtx?.drawImage(
                        img,
                        cropX, cropY, targetWidth, targetHeight, // **Crop area di gambar asli**
                        0, 0, 1080, 1350 // **Resize ke 1080x1350**
                    );

                    croppedData.push(cropCanvas.toDataURL("image/png"));
                }
            }
            onCroppedImages(croppedData);
        };
        setLoading(false);
    };

    // Panggil updateCanvas saat gambar dimuat atau ukuran container berubah
    useEffect(() => {
        if (prevRef.current) {
            setHeight(prevRef.current.clientHeight);
            setWidth(prevRef.current.clientWidth);
        }
        if (images && width && height) {
            updateCanvas();
        }
    }, [images, width, height]);

    useEffect(() => {
        if (images) {
            updateCanvas();
        }
    }, [images, gridCols, gridRows, cropMode, gridMode]);

  return (
    <div className="flex flex-1 flex-col md:flex-row md:gap-4">
                <div className="h-2/3 w-full bg-black/30 border-2 p-2 border-dashed border-black/50 rounded-xl justify-center items-center flex
                                md:h-full md:w-2/3
                ">
                    <div ref={prevRef} className="h-full w-full flex justify-center items-center">
                        <canvas className="border-1 md:border-2 border-black" ref={canvasRef} />
                    </div>
                </div>
    
                <div className="h-1/3 w-full pt-3 flex md:h-full md:w-1/3 md:justify-center md:items-center">
                  <div className="flex flex-col py-1 w-full">
                    <p className="flex items-center font-bold gap-2 text-black mb-1 md:text-2xl text-sm">
                      <Image
                        src="/type.svg"
                        width={20}
                        height={20}
                        alt="type image"
                      />
                      Type
                    </p>
                    <div
                      className={`inline-flex p-1 w-90 justify-between mb-2 md:mb-5 border-1 md:gap-1.5 border-black rounded-full relative md:w-full`}
                    >
                      <span
                        className={`absolute md:w-40 w-1/3 h-full bg-black top-0 rounded-full z-1 ${
                          cropMode === "grid"
                            ? "left-0"
                            : cropMode === "custom"
                            ? "right-0"
                            : "left-1/2 transform -translate-x-1/2 md:right-40"
                        }`}
                      ></span>
                      <button
                        onClick={() => {
                          setCropMode("grid");
                          resetGrid();
                        }}
                        className={`text-sm md:text-2xl md:w-37 z-2 w-30 px-4 rounded ${
                          cropMode === "grid"
                            ? "text-white font-bold"
                            : "text-black"
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => {
                          setCropMode("carousel");
                          resetGrid();
                        }}
                        className={`text-sm md:text-2xl md:w-37 z-2 w-30 px-4 rounded ${
                          cropMode === "carousel"
                            ? "text-white font-bold"
                            : "text-black"
                        }`}
                      >
                        Carousel
                      </button>
                      <button
                        onClick={() => {
                          setCropMode("custom");
                        }}
                        className={`text-sm md:text-2xl md:w-37 z-2 w-30 px-4 rounded ${
                          cropMode === "custom"
                            ? "text-white font-bold"
                            : "text-black"
                        }`}
                      >
                        Custom
                      </button>
                    </div>
    
                    <div
                      className={`flex ${
                        cropMode != "grid" ? "gap-5" : ""
                      } md:text-2xl mt-2`}
                    >
                      <div className="">
                        {(cropMode === "custom" || cropMode === "carousel") && (
                          <>
                            <p className="flex md:text-2xl items-center gap-2 text-black mb-1 font-bold text-sm">
                              <Image
                                src="/column.svg"
                                width={20}
                                height={20}
                                alt="columns image"
                              />
                              Columns
                            </p>
                            <div className="flex justify-center items-center mt-2">
                              <button onClick={handleRemoveColumn}>
                                <Image
                                  src="/minus.svg"
                                  width={28}
                                  height={28}
                                  alt="plus image"
                                  className="invert"
                                />
                              </button>
                              <h6 className="inline-flex text-black px-4">
                                {gridCols}
                              </h6>
                              <button onClick={handleAddColumn}>
                                <Image
                                  src="/plus.svg"
                                  width={28}
                                  height={28}
                                  alt="plus image"
                                  className="invert"
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
    
                      <div className="">
                        {(cropMode === "custom" || cropMode === "grid") && (
                          <>
                            <p className="flex md:text-2xl items-center gap-2 text-black font-bold mb-1 text-sm">
                              <Image
                                src="/row.svg"
                                width={20}
                                height={20}
                                alt="rows image"
                              />
                              Rows
                            </p>
                            <div className="flex justify-center items-center mt-2">
                              <button onClick={handleRemoveRow}>
                                <Image
                                  src="/minus.svg"
                                  width={28}
                                  height={28}
                                  alt="plus image"
                                  className="invert"
                                />
                              </button>
                              <h6 className="inline-flex text-black px-4">
                                {gridRows}
                              </h6>
                              <button onClick={handleAddRow}>
                                <Image
                                  src="/plus.svg"
                                  width={28}
                                  height={28}
                                  alt="plus image"
                                  className="invert"
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
    
                    {cropMode === "grid" && (
                        <>
                        
                            <p className="flex items-center font-bold gap-2 text-black mb-1 md:text-2xl text-sm mt-3">
                            <Image
                                src="/type.svg"
                                width={20}
                                height={20}
                                alt="type image"
                            />
                            {/* <VscSettings className="h-4 w-4 md:w-10 md:h-10"/> */}
                            Type of Grid
                            </p>
                            <div
                            className={`inline-flex p-1 w-3/4 justify-between border-1 md:gap-1.5 border-black rounded-full relative md:w-full`}
                            >
                            <span
                                className={`absolute w-1/2 h-full bg-black top-0 rounded-full z-1 ${
                                gridMode === "withgap"
                                    ? "left-0"
                                    : gridMode === "withoutgap"
                                    ? "right-0"
                                    : "left-1/2 transform -translate-x-1/2"
                                }`}
                            ></span>
                            <button
                                onClick={() => {
                                setGridMode("withgap");
                                resetGrid();
                                }}
                                className={`text-sm md:text-2xl z-2 w-1/2 px-4 rounded ${
                                gridMode === "withgap"
                                    ? "text-white font-bold"
                                    : "text-black"
                                }`}
                            >
                                With Gap
                            </button>
                            <button
                                onClick={() => {
                                setGridMode("withoutgap");
                                resetGrid();
                                }}
                                className={`text-sm md:text-2xl z-2 w-1/2 px-4 rounded ${
                                gridMode === "withoutgap"
                                    ? "text-white font-bold"
                                    : "text-black"
                                }`}
                            >
                                Without Gap
                            </button>
                            </div>
                        </>
                    )}

                    {cropMode !== "custom" && (
                        <p className="text-red-500 font-bold text-sm mt-2">
                            {`Resolution recommendations : ${
                                cropMode === "grid" ? (
                                    gridMode === "withgap" ? "3130px x " + gridRows * 1350 + "px" : "3110px x " + gridRows * 1350 + "px"
                                ) : (
                                    cropMode === "carousel" ? 1080 * gridCols + "px x 1350px" : ""
                                )}
                            `}
                        </p>
                    )}
    
                    <div className="w-full flex md:mt-7 pb-2 mt-4">
                      <button className="mt-2 md:text-2xl text-sm bg-black font-bold border-2 text-white w-1/2 py-3 rounded-full" onClick={() => {
                        handleCrop();
                      }}>
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span className="ml-2">Loading...</span>
                          </div>
                        ) : (
                          "Crop"
                        )}
                      </button>
                      <button className="mt-2 md:text-2xl text-sm border-2 border-black text-black w-1/2 py-3 rounded-full" onClick={() => {
                        images='';
                        onImageChange(images);
                      }}>
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  );
}