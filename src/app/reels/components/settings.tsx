"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

const ASPECT = 0.5625;
const IMG_HEIGHT_RATIO = 0.75;
const DEFAULT_CUSTOM_COLOR = "#222831";
const EXPORT_W = 1080;
const EXPORT_H = 1920;
const DEFAULT_CONTENT_BLUR = 10;

type AvgColorCacheKey = string;
interface AvgColorCache {
  [k: string]: string;
}

const MODES = ["content", "white", "black", "custom"] as const;
type ModeType = (typeof MODES)[number];

export default function Settings({ images, setImages }: { images: string, setImages: (images: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [containerH, setContainerH] = useState(0);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [guideRect, setGuideRect] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const [mode, setMode] = useState<ModeType>("content");
  const [modeIndex, setModeIndex] = useState(0);

  const [customColor, setCustomColor] = useState<string>(DEFAULT_CUSTOM_COLOR);
  const [customInput, setCustomInput] = useState<string>(DEFAULT_CUSTOM_COLOR);
  const [eyedropSupported, setEyedropSupported] = useState(false);
  const eyedropRef = useRef<any>(null);

  const [exporting, setExporting] = useState(false);
  const [contentBlur, setContentBlur] = useState(DEFAULT_CONTENT_BLUR);

  const avgColorCache = useRef<AvgColorCache>({});

  useEffect(() => {
    // @ts-ignore
    if (window.EyeDropper) {
      // @ts-ignore
      eyedropRef.current = new window.EyeDropper();
      setEyedropSupported(true);
    }
  }, []);

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image(); // gunakan constructor global, bukan komponen Next
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const measureContainer = () => {
    if (!containerRef.current) return;
    setContainerH(containerRef.current.clientHeight);
  };

  useEffect(() => {
    measureContainer();
    window.addEventListener("resize", measureContainer);
    return () => window.removeEventListener("resize", measureContainer);
  }, []);

  const getAverageColor = (
    img: HTMLImageElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    cacheKey: AvgColorCacheKey
  ): string => {
    if (avgColorCache.current[cacheKey]) return avgColorCache.current[cacheKey];
    try {
      const off = document.createElement("canvas");
      off.width = 1;
      off.height = 1;
      const octx = off.getContext("2d");
      if (!octx) return "#000000";
      // Draw source region scaled down to 1x1
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, 1, 1);
      const data = octx.getImageData(0, 0, 1, 1).data;
      const color = `rgb(${data[0]},${data[1]},${data[2]})`;
      avgColorCache.current[cacheKey] = color;
      return color;
    } catch {
      return "#000000";
    }
  };

  // drawComposite pakai parameter eksplisit (tidak tergantung state closures)
  const drawComposite = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    img: HTMLImageElement,
    useMode: ModeType,
    useCustomColor: string,
    useBlur: number
  ) => {
    ctx.clearRect(0, 0, W, H);

    if (useMode === "white") ctx.fillStyle = "#ffffff";
    else if (useMode === "black") ctx.fillStyle = "#000000";
    else if (useMode === "custom") ctx.fillStyle = useCustomColor;
    else ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, W, H);

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const targetImgH = H * IMG_HEIGHT_RATIO;
    const scale = targetImgH / naturalH;
    const targetImgW = naturalW * scale;
    const destY = (H - targetImgH) / 2;

    let srcX = 0;
    let visibleSourceW = naturalW;
    if (targetImgW > W) {
      visibleSourceW = W / scale;
      srcX = (naturalW - visibleSourceW) / 2;
    }

    if (useMode === "content" && destY > 0) {
      const sliceSourceH = destY / scale;
      const topColor = getAverageColor(
        img,
        srcX,
        0,
        visibleSourceW,
        sliceSourceH,
        `top:${srcX}:${visibleSourceW}:${sliceSourceH}`
      );
      const bottomColor = getAverageColor(
        img,
        srcX,
        naturalH - sliceSourceH,
        visibleSourceW,
        sliceSourceH,
        `bot:${srcX}:${visibleSourceW}:${sliceSourceH}`
      );
      ctx.fillStyle = topColor;
      ctx.fillRect(0, 0, W, destY);
      ctx.fillStyle = bottomColor;
      ctx.fillRect(0, destY + targetImgH, W, destY);
      ctx.filter = `blur(${useBlur}px)`;
      ctx.drawImage(img, srcX, 0, visibleSourceW, sliceSourceH, 0, 0, W, destY);
      ctx.drawImage(
        img,
        srcX,
        naturalH - sliceSourceH,
        visibleSourceW,
        sliceSourceH,
        0,
        destY + targetImgH,
        W,
        destY
      );
      ctx.filter = "none";
    }

    const destX = targetImgW <= W ? (W - targetImgW) / 2 : 0;
    ctx.drawImage(
      img,
      srcX,
      0,
      visibleSourceW,
      naturalH,
      destX,
      destY,
      targetImgW <= W ? targetImgW : W,
      targetImgH
    );

    return { destY, targetImgH };
  };

  const drawCurrent = (
    overrideMode?: ModeType,
    overrideColor?: string,
    overrideBlur?: number
  ) => {
    const img = imageRef.current;
    if (!img || !canvasRef.current || !containerH) return;
    const canvasH = containerH;
    const canvasW = Math.round(canvasH * ASPECT);
    const canvas = canvasRef.current;
    if (canvas.width !== canvasW || canvas.height !== canvasH) {
      canvas.width = canvasW;
      canvas.height = canvasH;
      setCanvasSize({ w: canvasW, h: canvasH });
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const res = drawComposite(
      ctx,
      canvasW,
      canvasH,
      img,
      overrideMode || mode,
      overrideColor || customColor,
      overrideBlur === undefined ? contentBlur : overrideBlur
    );
    setGuideRect({ top: res.destY, height: res.targetImgH });
  };

  // Load image sekali saat 'images' berubah
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!images) return;
      try {
        const img = await loadImage(images);
        if (cancelled) return;
        imageRef.current = img;
        setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
        drawCurrent();
      } catch (e) {
        console.error("Gagal memuat gambar:", e);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [images]);

  // Redraw ketika container resize
  useEffect(() => {
    if (imageRef.current) drawCurrent();
  }, [containerH]);

  // Redraw ketika mode / customColor berubah
  useEffect(() => {
    if (imageRef.current) drawCurrent();
  }, [mode, customColor, contentBlur]);

  // Set backgroundColor elemen canvas (untuk mode non-content)
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.backgroundColor =
      mode === "white"
        ? "#ffffff"
        : mode === "black"
        ? "#000000"
        : mode === "custom"
        ? customColor
        : "transparent";
  }, [mode, customColor]);

  const handleCustomTextChange = (val: string) => {
    setCustomInput(val);
    const trimmed = val.trim();
    const hexOk = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed);
    const fnOk = /^(rgb|rgba|hsl|hsla)\(/i.test(trimmed);
    if (hexOk || fnOk) {
      setCustomColor(trimmed);
      drawCurrent(undefined, trimmed); // immediate
    }
  };

  const pickEyedrop = async () => {
    if (!eyedropRef.current) return;
    try {
      const result = await eyedropRef.current.open();
      if (result?.sRGBHex) {
        setCustomColor(result.sRGBHex);
        setCustomInput(result.sRGBHex);
        drawCurrent(undefined, result.sRGBHex);
      }
    } catch {}
  };

  const handleChangeMode = (next: ModeType) => {
    if (next === mode) return;
    const idx = MODES.indexOf(next);
    setModeIndex(idx);
    setMode(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drawCurrent(next, undefined, contentBlur);
      });
    });
  };

  const downloadImage = async () => {
    if (exporting || !imageRef.current) return;
    setExporting(true);
    try {
      const off = document.createElement("canvas");
      off.width = EXPORT_W;
      off.height = EXPORT_H;
      const ctx = off.getContext("2d");
      if (!ctx) throw new Error("Context gagal");
      drawComposite(
        ctx,
        EXPORT_W,
        EXPORT_H,
        imageRef.current,
        mode,
        customColor,
        contentBlur
      );
      off.toBlob((blob) => {
        if (!blob) {
          setExporting(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reels_canvas_1080x1920.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setExporting(false);
      }, "image/png");
    } catch (e) {
      console.error(e);
      setExporting(false);
    }
  };

  return (
    <>
      <div className="md:col-span-13 md:p-6 p-2 rounded-xl bg-custom-3 row-span-13 md:row-span-1">
        <div
          ref={containerRef}
          className="h-full w-full flex flex-col items-center justify-center gap-3"
        >
          <div
            className="relative"
            style={{
              width: canvasSize ? canvasSize.w : undefined,
              height: canvasSize ? canvasSize.h : undefined,
              maxWidth: "100%",
            }}
          >
            <canvas
              ref={canvasRef}
              className="border border-black rounded block"
              style={{
                maxWidth: "100%",
                width: canvasSize ? canvasSize.w : "auto",
                height: canvasSize ? canvasSize.h : "auto",
              }}
            />
            {showGuide && canvasSize && guideRect && (
              <div
                className="absolute left-0 w-full pointer-events-none flex items-stretch"
                style={{ top: guideRect.top, height: guideRect.height }}
              >
                <div className="w-full h-full border-2 border-red-500/80 rounded-sm" />
              </div>
            )}
            {showGuide && guideRect && (
              <span className="absolute top-2 right-2 text-[10px] px-2 py-1 bg-red-600/70 text-white rounded">
                Preview Instagram
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-7 md:p-4 flex flex-1 flex-col gap-4 justify-between row-span-7 md:row-span-1">
        <div className="md:flex hidden items-center justify-center w-full">
          <NextImage
            src="/starship.svg"
            alt="Reels icon"
            width={50}
            height={50}
            className="h-8 w-8 md:w-60 md:h-60 md:mb-7 mb-4"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-between">
          <div>
            <div className="flex items-center gap-2 w-fit py-2 rounded">
              <NextImage
                src="/type.svg"
                alt="Type icon"
                width={50}
                height={50}
                className="md:h-6 md:w-6 h-5 w-5"
              />
              <h3 className="font-bold md:text-lg text-md leading-none">Type Reels Mode</h3>
            </div>
            <ModeSwitch
              mode={mode}
              modeIndex={modeIndex}
              onChange={handleChangeMode}
            />

            {/* Content Blur Panel (collapse) */}
            <div
              className={`transition-all duration-500 ease-in-out
                ${mode === "content"
                  ? "grid grid-rows-[1fr] opacity-100"
                  : "grid grid-rows-[0fr] opacity-0"}`
              }
            >
              <div className="overflow-hidden flex flex-col gap-3 origin-top">
                <div className="space-y-1">
                  <label className="flex items-center justify-between md:text-md text-sm font-medium text-black">
                    <span>Blur Filter</span>
                    <span className="tabular-nums">{contentBlur}px</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={contentBlur}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setContentBlur(v);
                      drawCurrent(undefined, undefined, v);
                    }}
                    className="w-full accent-black cursor-pointer"
                    disabled={mode !== "content"}
                  />
                </div>
              </div>
            </div>

            {/* Custom Color Panel (collapse) */}
            <div
              className={`transition-all duration-500 ease-in-out
                ${mode === "custom"
                  ? "grid grid-rows-[1fr] opacity-100"
                  : "grid grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden flex flex-col gap-2 origin-top">
                <span className="tracking-wide text-md font-medium text-black">
                  Custom Background
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={mode !== "custom"}
                    value={
                      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(customColor)
                        ? customColor
                        : "#000000"
                    }
                    onChange={(e) => {
                      if (mode !== "custom") return;
                      setCustomColor(e.target.value);
                      setCustomInput(e.target.value);
                      drawCurrent(undefined, e.target.value);
                    }}
                    className="h-9 w-9 p-0 border border-black/20 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition"
                  />
                  <input
                    disabled={mode !== "custom"}
                    value={customInput}
                    onChange={(e) => {
                      if (mode !== "custom") return;
                      handleCustomTextChange(e.target.value);
                    }}
                    placeholder="#112233 atau rgb(0,0,0)"
                    className="flex-1 h-9 text-xs px-4 rounded-full border border-black/25 outline-none focus:ring-2 ring-blue-400/50 bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  />
                  <button
                    type="button"
                    disabled={!eyedropSupported || mode !== "custom"}
                    onClick={pickEyedrop}
                    className={`h-9 w-9 flex justify-center items-center text-[11px] font-medium rounded-full border-black/25 border transition ${
                      eyedropSupported && mode === "custom"
                        ? "bg-white text-white hover:bg-blue-200 active:scale-[.97]"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <NextImage
                      src="/pipet.svg"
                      alt="Pipet"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Toggle Preview (Guide) */}
            <div className="mb-4">
              <label
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={showGuide}
                  onChange={() => setShowGuide(s => !s)}
                  className="peer sr-only"
                  aria-label="Toggle preview guide"
                />
                <span
                  className="relative inline-flex h-6 w-11 rounded-full transition-colors
                    bg-gray-300 peer-checked:bg-green-500"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow
                      transition-transform duration-300 ease-out
                      ${showGuide ? "translate-x-5" : ""}`}
                  />
                </span>
                <span className="text-xs font-medium tracking-wide text-black/60">
                  {showGuide ? "Preview ON" : "Preview OFF"}
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImages("");
                  setMode("content");
                  setModeIndex(0);
                  setCustomColor(DEFAULT_CUSTOM_COLOR);
                  setCustomInput(DEFAULT_CUSTOM_COLOR);
                  setContentBlur(DEFAULT_CONTENT_BLUR);
                }}
                className={`px-4 md:py-3 py-2 md:text-md text-sm font-medium border border-black/50 w-full rounded-full transition duration-500 ${
                  !imageRef.current || exporting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "text-black hover:bg-black/10 active:scale-[.97]"
                }`}
              >
                Back
              </button>
              <button
                onClick={downloadImage}
                disabled={!imageRef.current || exporting}
                className={`px-4 md:py-3 py-2 md:text-md text-sm font-medium border w-full rounded-full transition duration-500 ${
                  !imageRef.current || exporting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:bg-green-500 active:scale-[.97]"
                }`}
              >
                {exporting ? "Menyimpan..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ModeSwitch({
  mode,
  modeIndex,
  onChange,
}: {
  mode: ModeType;
  modeIndex: number;
  onChange: (m: ModeType) => void;
}) {
  return (
    <div className="relative flex md:h-10 h-8 w-full rounded-full bg-custom-3  select-none overflow-hidden shadow-sm md:border-4 border-2 border-custom-3 mb-5">
      <div
        // Indicator hitam
        className="absolute top-0 bottom-0 left-0 rounded-full bg-black shadow-md transition-transform duration-500 ease-in-out will-change-transform"
        style={{
          width: `${100 / MODES.length}%`,
          transform: `translateX(${modeIndex * 100}%)`,
        }}
      />
      {MODES.map((m) => {
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={`relative z-10 flex-1 md:text-md text-sm font-bold first-letter:uppercase tracking-wide transition-colors duration-200 cursor-pointer ${
              active ? "text-white" : "text-black/60 hover:text-black"
            }`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
