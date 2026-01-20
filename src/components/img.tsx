import { useMemo } from "react";

const imageWidths = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
] as const;

type ImgWidth = (typeof imageWidths)[number];

const getVercelOptimizedUrl = (url: string, width: ImgWidth) => {
  const searchParams = new URLSearchParams();
  searchParams.append("url", url);
  searchParams.append("w", width.toString());
  searchParams.append("q", "75");
  return `/_vercel/image?${searchParams.toString()}`;
};

export const useVercelOptimizedImageProps = (
  src: string,
  width: number,
  height: number,
) =>
  useMemo(() => {
    if (
      !import.meta.env.VITE_VERCEL_ENV ||
      import.meta.env.VITE_VERCEL_ENV === "development"
    )
      return { src, width, height };
    const widths = [
      ...new Set(
        [width, width * 2].map(
          (w) => imageWidths.find((p) => p >= w) || imageWidths.at(-1)!,
        ),
      ),
    ] as [ImgWidth, ...Array<ImgWidth>];
    return {
      srcSet: widths
        .map((w, i) => `${getVercelOptimizedUrl(src, w)} ${i + 1}x`)
        .join(", "),
      width: widths[0],
      height: Math.round((widths[0] * height) / width),
    };
  }, [src, width, height]);

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const Image = ({
  src,
  width,
  height,
  loading = "lazy",
  ...props
}: ImageProps) => {
  const imgProps = useVercelOptimizedImageProps(src, width, height);
  return <img loading={loading} {...imgProps} {...props} />;
};