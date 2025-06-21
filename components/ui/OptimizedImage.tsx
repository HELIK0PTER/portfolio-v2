import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 90,
  sizes,
  className,
  placeholder,
  blurDataURL,
}: OptimizedImageProps) {

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
} 