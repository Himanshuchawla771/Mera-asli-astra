import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCw, 
  Sparkles, 
  Sliders, 
  Check, 
  X, 
  Contrast, 
  Sun, 
  FileText, 
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  ImageIcon
} from 'lucide-react';

export interface ScannedPageItem {
  id: string;
  dataUrl: string;
  fileName: string;
  pageNumber: number;
}

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCaptured?: (dataUrl: string, fileName: string) => void;
  onPagesCaptured?: (pages: ScannedPageItem[]) => void;
  onApplyEnhancedImage?: (enhancedBase64: string, originalBase64: string) => void;
  initialImageDataUrl?: string;
  initialPages?: ScannedPageItem[];
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  isOpen,
  onClose,
  onImageCaptured,
  onPagesCaptured,
  onApplyEnhancedImage,
  initialImageDataUrl,
  initialPages = []
}) => {
  const [sourceImage, setSourceImage] = useState<string | null>(initialImageDataUrl || null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [pages, setPages] = useState<ScannedPageItem[]>(initialPages);
  
  // Filter settings
  const [filterMode, setFilterMode] = useState<'enhanced' | 'bw' | 'original'>('enhanced');
  const [contrast, setContrast] = useState<number>(1.25);
  const [brightness, setBrightness] = useState<number>(1.1);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Live Camera stream
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageDataUrl) {
      setSourceImage(initialImageDataUrl);
      applyCanvasFilter(initialImageDataUrl, filterMode, contrast, brightness, rotation);
    }
  }, [initialImageDataUrl]);

  useEffect(() => {
    if (initialPages && initialPages.length > 0) {
      setPages(initialPages);
    }
  }, [initialPages]);

  // Clean up camera stream when closing modal
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const triggerNativeCamera = () => {
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Webcam stream is restricted. Please tap "Snap with Camera" to open your device camera.');
      return;
    }

    try {
      // Try high resolution back camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      }).catch(async () => {
        // Fallback to standard video stream
        return await navigator.mediaDevices.getUserMedia({ video: true });
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Live camera stream not allowed:', err);
      setCameraError('Live camera stream is restricted in this window. Tap "Snap with Camera" below to take a photo using your device camera.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setSourceImage(dataUrl);
    stopCamera();
    applyCanvasFilter(dataUrl, filterMode, contrast, brightness, rotation);
  };

  // High-Speed Canvas Image Processor (Removes notebook shadows & boosts OCR readability)
  const applyCanvasFilter = (
    imageSrc: string, 
    mode: 'enhanced' | 'bw' | 'original', 
    contVal: number, 
    brightVal: number, 
    rotDeg: number
  ) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Handle 90/270 deg rotation canvas dimension flips
      const isRotated90 = (rotDeg / 90) % 2 !== 0;
      canvas.width = isRotated90 ? img.height : img.width;
      canvas.height = isRotated90 ? img.width : img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotDeg * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      if (mode !== 'original') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // 1. Convert to Grayscale luminance
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          if (mode === 'bw') {
            // Adaptive B&W threshold (Clear paper white & crisp ink)
            const threshold = 140 * brightVal;
            const finalVal = gray > threshold ? 255 : 0;
            data[i] = finalVal;
            data[i + 1] = finalVal;
            data[i + 2] = finalVal;
          } else {
            // 'enhanced' Magic Document Filter (Shadow Removal + Contrast Boost)
            // Apply brightness
            let val = gray * brightVal;
            // Apply contrast
            val = (val - 128) * contVal + 128;
            // Clamp
            val = Math.max(0, Math.min(255, val));

            // Whiten yellow/shadowed background slightly
            if (val > 185) {
              val = Math.min(255, val * 1.12);
            }

            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const processedData = canvas.toDataURL('image/jpeg', 0.92);
      setEnhancedImage(processedData);
      setIsProcessing(false);
    };

    img.src = imageSrc;
  };

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
    if (sourceImage) {
      applyCanvasFilter(sourceImage, filterMode, contrast, brightness, nextRot);
    }
  };

  const handleFilterChange = (mode: 'enhanced' | 'bw' | 'original') => {
    setFilterMode(mode);
    if (sourceImage) {
      applyCanvasFilter(sourceImage, mode, contrast, brightness, rotation);
    }
  };

  // Add current active image into pages list
  const handleSavePageAndNext = () => {
    const finalData = enhancedImage || sourceImage;
    if (!finalData) return;

    const newPageNumber = pages.length + 1;
    const newPage: ScannedPageItem = {
      id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dataUrl: finalData,
      fileName: `Page_${newPageNumber}.jpg`,
      pageNumber: newPageNumber
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setSourceImage(null);
    setEnhancedImage(null);
    setRotation(0);

    // Trigger native camera or webcam for next page
    setTimeout(() => {
      if (nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
      }
    }, 200);
  };

  const handleFinishAll = () => {
    const finalData = enhancedImage || sourceImage;
    let finalPages = [...pages];

    if (finalData) {
      const newPageNumber = finalPages.length + 1;
      finalPages.push({
        id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        dataUrl: finalData,
        fileName: `Page_${newPageNumber}.jpg`,
        pageNumber: newPageNumber
      });
    }

    if (finalPages.length === 0) {
      onClose();
      return;
    }

    if (onPagesCaptured) {
      onPagesCaptured(finalPages);
    }
    if (onImageCaptured && finalPages.length > 0) {
      onImageCaptured(finalPages[0].dataUrl, finalPages[0].fileName);
    }
    if (onApplyEnhancedImage && finalPages.length > 0) {
      onApplyEnhancedImage(finalPages[0].dataUrl, finalPages[0].dataUrl);
    }
    onClose();
  };

  const handleRemovePage = (pageId: string) => {
    const updated = pages.filter(p => p.id !== pageId).map((p, idx) => ({
      ...p,
      pageNumber: idx + 1,
      fileName: `Page_${idx + 1}.jpg`
    }));
    setPages(updated);
  };

  const handleMultipleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newItems: Promise<ScannedPageItem>[] = [];

    Array.from(fileList).forEach((file, index) => {
      newItems.push(new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          resolve({
            id: `page_${Date.now()}_${index}`,
            dataUrl,
            fileName: file.name || `Page_${pages.length + index + 1}.jpg`,
            pageNumber: pages.length + index + 1
          });
        };
        reader.readAsDataURL(file);
      }));
    });

    Promise.all(newItems).then(loaded => {
      const combined = [...pages, ...loaded].map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      setPages(combined);
      if (combined.length > 0 && !sourceImage) {
        setSourceImage(combined[combined.length - 1].dataUrl);
        applyCanvasFilter(combined[combined.length - 1].dataUrl, filterMode, contrast, brightness, rotation);
      }
    });
  };

  const handleApply = () => {
    handleFinishAll();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span>Multi-Page Exam Document Scanner</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                  {pages.length + (sourceImage ? 1 : 0)} Page{(pages.length + (sourceImage ? 1 : 0)) !== 1 ? 's' : ''} Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Capture single or multiple pages of your handwritten copy with auto shadow removal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filmstrip of pages captured so far */}
        {pages.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-slate-400">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pages ({pages.length}):</span>
            </div>
            <div className="flex items-center gap-2">
              {pages.map((p, idx) => (
                <div 
                  key={p.id}
                  className="relative group shrink-0 w-14 h-16 rounded-lg border border-slate-700 bg-slate-800 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSourceImage(p.dataUrl);
                    applyCanvasFilter(p.dataUrl, filterMode, contrast, brightness, rotation);
                  }}
                  title={`View Page ${idx + 1}`}
                >
                  <img src={p.dataUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-center text-indigo-300 font-extrabold py-0.5">
                    P{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePage(p.id);
                    }}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove this page"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="ml-auto shrink-0 flex items-center gap-2">
              <label
                htmlFor="scanner-snap-next-camera-btn"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Page</span>
              </label>
              <input
                id="scanner-snap-next-camera-btn"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const url = ev.target?.result as string;
                      setSourceImage(url);
                      applyCanvasFilter(url, filterMode, contrast, brightness, rotation);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Hidden inputs for camera and gallery */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => {
                const url = ev.target?.result as string;
                setSourceImage(url);
                applyCanvasFilter(url, filterMode, contrast, brightness, rotation);
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Viewport Canvas / Camera Body */}
        <div className="flex-1 p-4 bg-slate-950 flex flex-col items-center justify-center min-h-[280px] max-h-[420px] overflow-hidden relative">
          {isCameraActive ? (
            /* Live Camera Feed */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-h-[360px] w-auto rounded-2xl border border-slate-700 shadow-lg object-contain"
              />
              <div className="absolute bottom-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Page</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : sourceImage ? (
            /* Processed / Preview Image */
            <div className="relative max-h-[360px] max-w-full flex items-center justify-center">
              <img
                src={enhancedImage || sourceImage}
                alt="Document Preview"
                className="max-h-[340px] max-w-full rounded-2xl border border-slate-800 object-contain shadow-md"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-indigo-300">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Enhancing document...</span>
                </div>
              )}
            </div>
          ) : (
            /* Initial Actions: Open Camera or Upload Image */
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-indigo-400 mx-auto flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">
                  {pages.length > 0 ? `Add Page ${pages.length + 1} to your answer sheet` : 'Take a photo of your handwritten answer sheet'}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  You can snap photos of multiple pages one after another, or select multiple photos from your gallery at once.
                </p>
              </div>

              {cameraError && (
                <p className="text-[11px] text-amber-400 max-w-xs mx-auto">
                  {cameraError}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {/* Direct Native Camera trigger via label */}
                <label
                  htmlFor="scanner-snap-camera-btn"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo with Camera</span>
                </label>
                <input
                  id="scanner-snap-camera-btn"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const url = ev.target?.result as string;
                        setSourceImage(url);
                        applyCanvasFilter(url, filterMode, contrast, brightness, rotation);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-400" />
                  <span>Live Webcam</span>
                </button>

                <label
                  htmlFor="scanner-browse-photo-btn"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photos (Multiple)</span>
                </label>
                <input
                  id="scanner-browse-photo-btn"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleMultipleFilesSelected(e.target.files)}
                />
              </div>

              {pages.length > 0 && (
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleFinishAll}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done! Use All {pages.length} Pages</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toolbar & Filters (when an image is active) */}
        {sourceImage && !isCameraActive && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Presets */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleFilterChange('enhanced')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    filterMode === 'enhanced'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Enhanced</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFilterChange('bw')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    filterMode === 'bw'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Contrast className="w-3.5 h-3.5" />
                  <span>High B&amp;W</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFilterChange('original')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    filterMode === 'original'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Original</span>
                </button>
              </div>

              {/* Tools */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate {rotation}°</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSourceImage(null);
                    setEnhancedImage(null);
                    setRotation(0);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Retake
                </button>
              </div>
            </div>

            {/* Bottom Multi-Page Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Page {pages.length + 1} ready. Add more pages or finish now.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSavePageAndNext}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Save this page and take a photo of the next page"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Save &amp; Snap Next Page</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishAll}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Finish &amp; Use All ({pages.length + 1} Pages)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
