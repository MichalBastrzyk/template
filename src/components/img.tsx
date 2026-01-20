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
  /** Intrinsic width of the source image */
  width: number;
  /** Intrinsic height of the source image */
  height: number;
  /**
   * The sizes attribute for responsive images.
   * @default "100vw"
   * @example "(max-width: 768px) 100vw, 50vw"
   */
  sizes?: string;
  /** Image quality 1-100 @default 75 */
  quality?: number;
}

/**
 * Generates props for a responsive image with Vercel Image Optimization.
 * Uses width descriptors (w) so the browser can select the optimal size
 * based on viewport width and device pixel ratio.
 */
export const useResponsiveImageProps = ({
  src,
  width,
  height,
  sizes = "100vw",
  quality = 75,
}: ResponsiveImageOptions) =>
  useMemo(() => {
    // Find the smallest preset width that can contain the original
    const maxWidth = imageWidths.find((w) => w >= width) ?? imageWidths.at(-1)!;

    // Generate srcSet for all widths up to and including the max
    const applicableWidths = imageWidths.filter((w) => w <= maxWidth);

    const srcSet = applicableWidths
      .map((w) => `${getVercelOptimizedUrl(src, w, quality)} ${w}w`)
      .join(", ");

    // Use largest applicable width as the fallback src
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
  /** Intrinsic width of the source image */
  width: number;
  /** Intrinsic height of the source image */
  height: number;
  alt: string;
  /**
   * The sizes attribute for responsive images.
   * @default "100vw"
   * @example "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
   */
  sizes?: string;
  /** Image quality 1-100 @default 75 */
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
