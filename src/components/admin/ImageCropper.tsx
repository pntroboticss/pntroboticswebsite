"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, Check, X } from "lucide-react";

interface ImageCropperProps {
    file: File;
    aspectRatio?: number; // e.g. 1 for square, 16/9 for wide
    onCropComplete: (croppedFile: File) => void;
    onCancel: () => void;
}

export default function ImageCropper({ file, aspectRatio = 1, onCropComplete, onCancel }: ImageCropperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Load image from file
    useEffect(() => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setImage(img);
            URL.revokeObjectURL(url);
        };
        img.src = url;
        
        return () => URL.revokeObjectURL(url);
    }, [file]);

    // Draw image to canvas
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !image) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Container dimensions
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Calculate crop area dimensions based on aspect ratio
        let cropWidth = containerWidth * 0.8;
        let cropHeight = cropWidth / aspectRatio;
        
        if (cropHeight > containerHeight * 0.8) {
            cropHeight = containerHeight * 0.8;
            cropWidth = cropHeight * aspectRatio;
        }

        const cropX = (containerWidth - cropWidth) / 2;
        const cropY = (containerHeight - cropHeight) / 2;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fill background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Dark overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clear crop area (create the "hole")
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(cropX, cropY, cropWidth, cropHeight);
        ctx.globalCompositeOperation = "source-over";

        // Draw image UNDER the overlay
        ctx.globalCompositeOperation = "destination-over";

        // Calculate initial image fit (cover the crop area)
        const scaleX = cropWidth / image.width;
        const scaleY = cropHeight / image.height;
        const minScale = Math.max(scaleX, scaleY);
        
        // Actual draw scale
        const currentScale = minScale * scale;

        const drawWidth = image.width * currentScale;
        const drawHeight = image.height * currentScale;

        // Center position + user drag offset
        // Ensure the image cannot be dragged outside the crop bounds
        const centerX = cropX + cropWidth / 2;
        const centerY = cropY + cropHeight / 2;
        
        let dx = centerX - drawWidth / 2 + position.x;
        let dy = centerY - drawHeight / 2 + position.y;

        // Clamp positions to ensure no empty space in crop box
        const maxDx = cropX;
        const minDx = cropX + cropWidth - drawWidth;
        const maxDy = cropY;
        const minDy = cropY + cropHeight - drawHeight;

        dx = Math.min(Math.max(dx, minDx), maxDx);
        dy = Math.min(Math.max(dy, minDy), maxDy);

        // If we clamped, optionally update state so next drag starts from right place
        // (Decided not to update state here to avoid jitter, but drawing is clamped)

        ctx.drawImage(image, dx, dy, drawWidth, drawHeight);

        // Draw crop border
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
        ctx.setLineDash([]); // reset

    }, [image, scale, position, aspectRatio]);

    useEffect(() => {
        draw();
    }, [draw]);

    // Mouse / Touch Events for Dragging
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        setDragStart({ x: clientX - position.x, y: clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        setPosition({
            x: clientX - dragStart.x,
            y: clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Output final cropped image
    const handleCrop = () => {
        if (!image || !canvasRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        
        let cropWidth = containerWidth * 0.8;
        let cropHeight = cropWidth / aspectRatio;
        
        if (cropHeight > containerHeight * 0.8) {
            cropHeight = containerHeight * 0.8;
            cropWidth = cropHeight * aspectRatio;
        }

        const cropX = (containerWidth - cropWidth) / 2;
        const cropY = (containerHeight - cropHeight) / 2;

        const scaleX = cropWidth / image.width;
        const scaleY = cropHeight / image.height;
        const minScale = Math.max(scaleX, scaleY);
        const currentScale = minScale * scale;

        const drawWidth = image.width * currentScale;
        const drawHeight = image.height * currentScale;

        const centerX = cropX + cropWidth / 2;
        const centerY = cropY + cropHeight / 2;
        
        let dx = centerX - drawWidth / 2 + position.x;
        let dy = centerY - drawHeight / 2 + position.y;

        const maxDx = cropX;
        const minDx = cropX + cropWidth - drawWidth;
        const maxDy = cropY;
        const minDy = cropY + cropHeight - drawHeight;

        dx = Math.min(Math.max(dx, minDx), maxDx);
        dy = Math.min(Math.max(dy, minDy), maxDy);

        // Create an offscreen canvas to extract just the cropped portion
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 512; // Standardize output size (512x512)
        tempCanvas.height = 512 / aspectRatio;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        // Calculate source rectangle from original image
        // Math to map the crop rectangle back to original image coordinates
        const sourceX = (cropX - dx) / currentScale;
        const sourceY = (cropY - dy) / currentScale;
        const sourceWidth = cropWidth / currentScale;
        const sourceHeight = cropHeight / currentScale;

        ctx.drawImage(
            image,
            sourceX, sourceY, sourceWidth, sourceHeight, // Source rect
            0, 0, tempCanvas.width, tempCanvas.height // Destination rect
        );

        tempCanvas.toBlob((blob) => {
            if (!blob) return;
            // Handle output format retaining original type if possible, or fallback to webp
            const fileType = file.type === "image/gif" ? "image/gif" : "image/webp";
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: fileType });
            onCropComplete(newFile);
        }, file.type === "image/gif" ? "image/gif" : "image/webp", 0.9);
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">Crop & Position Image</h3>
                    <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Canvas Area */}
                <div 
                    ref={containerRef}
                    className="relative w-full h-[60vh] md:h-[500px] cursor-move select-none touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
                    
                    {!image && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/50">
                            Loading image...
                        </div>
                    )}
                </div>

                {/* Controls Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-1/2">
                        <button onClick={() => setScale(Math.max(1, scale - 0.1))} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full focus:outline-none">
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <input 
                            type="range" 
                            min="1" 
                            max="3" 
                            step="0.05" 
                            value={scale} 
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="flex-1 accent-blue-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <button onClick={() => setScale(Math.min(3, scale + 0.1))} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full focus:outline-none">
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex w-full sm:w-auto gap-3">
                        <button onClick={onCancel} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleCrop} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                            <Check className="w-4 h-4" />
                            Apply Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
