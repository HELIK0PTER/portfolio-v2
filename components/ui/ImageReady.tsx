"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { X, Search } from "lucide-react";

interface ImageReadyProps extends ImageProps {
  // Hérite de toutes les props d'Image
  className?: string;
}

export function ImageReady({ alt, className, ...props }: ImageReadyProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Fermer avec Échap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowPreview(false);
      }
    }
    if (showPreview) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showPreview]);

  return (
    <>
      {/* Image cliquable */}
      <div className="relative group inline-block w-full h-full flex-1">
        <Image
          {...props}
          alt={alt}
          width={props.width ? Number(props.width) : 1600}
          height={props.height ? Number(props.height) : 900}
          className={`h-full w-full object-cover cursor-pointer transition-opacity hover:opacity-80 ${className || ""}`}
        />
        {/* Overlay avec loupe au hover */}
        <div
          onClick={() => setShowPreview(true)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center m-0.5"
        >
          <Search className="h-8 w-8 text-white/70" />
        </div>
      </div>

      {/* Popup preview */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 dark:text-white text-black hover:text-gray-300 transition-colors"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            {/* Image en grand */}
            <Image
              {...props}
              alt={alt}
              className="max-w-full max-h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              width={props.width ? Number(props.width) * 1.5 : 1600}
              height={props.height ? Number(props.height) * 1.5 : 900}
            />
          </div>
        </div>
      )}
    </>
  );
}
