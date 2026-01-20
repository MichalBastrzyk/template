import { env } from "@/env";
import { useMemo } from "react";

const imageWidths = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
] as const;

type ImgWidth = (typeof imageWidths)[number];

const getVercelOptimizedUrl = (url: string, width: ImgWidth, quality = 75) => {
  const searchParams = new URLSearchParams();
  searchParams.append("url", url);
  searchParams.append("w", width.toString());
  searchParams.append("q", quality.toString());
  return `/_vercel/image?${searchParams.toString()}`;
};

interface ResponsiveImageOptions {
  src: string;
  width: number;
  height: number;
  sizes?: string;
  quality?: number;
}

export const useResponsiveImageProps = ({
  src,
  width,
  height,
  sizes = "100vw",
  quality = 75,
}: ResponsiveImageOptions) =>
  useMemo(() => {
    if (!env.VITE_VERCEL_ENV || env.VITE_VERCEL_ENV === "development")
      return {
        src,
        width,
        height,
        sizes,
        quality,
      };
    const maxWidth = imageWidths.find((w) => w >= width) ?? imageWidths.at(-1)!;
    const applicableWidths = imageWidths.filter((w) => w <= maxWidth);
    const srcSet = applicableWidths
      .map((w) => `${getVercelOptimizedUrl(src, w, quality)} ${w}w`)
      .join(", ");
    const fallbackWidth = applicableWidths.at(-1)!;

    return {
      src: getVercelOptimizedUrl(src, fallbackWidth, quality),
      srcSet,
      sizes,
      width: fallbackWidth,
      height: Math.round((fallbackWidth * height) / width),
    };
  }, [src, width, height, sizes, quality]);

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes?: string;
  quality?: number;
}

export const Image = ({
  src,
  width,
  height,
  sizes,
  quality,
  loading = "lazy",
  decoding = "async",
  ...props
}: ImageProps) => {
  const imgProps = useResponsiveImageProps({
    src,
    width,
    height,
    sizes,
    quality,
  });
  return <img loading={loading} decoding={decoding} {...imgProps} {...props} />;
};
