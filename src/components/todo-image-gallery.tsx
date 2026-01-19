import * as React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TodoImage {
  id: number;
  filePath: string;
  width: number;
  height: number;
}

interface TodoImageGalleryProps {
  images: TodoImage[];
  onImageClick: (index: number) => void;
  className?: string;
}

export function TodoImageGallery({
  images,
  onImageClick,
  className,
}: TodoImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <ScrollArea className={cn("w-full", className)}>
      <div className="flex gap-2 pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onImageClick(index)}
            className="group relative flex-shrink-0"
          >
            <AspectRatio ratio={1} className="w-20 rounded-md border border-border/60 overflow-hidden">
              <img
                src={`/api/images/${image.filePath}`}
                alt={`Todo image ${index + 1}`}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                loading="lazy"
              />
            </AspectRatio>
          </button>
        ))}
        <Badge variant="secondary" className="self-center flex-shrink-0">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
