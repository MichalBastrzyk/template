import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodoImage {
  id: number;
  filePath: string;
  filename: string;
  width: number;
  height: number;
  fileSize: number;
}

interface ImageCarouselDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: TodoImage[];
  startIndex: number;
}

export function ImageCarouselDialog({
  open,
  onOpenChange,
  images,
  startIndex,
}: ImageCarouselDialogProps) {
  const [api, setApi] = React.useState<ReturnType<typeof useEmblaCarousel>[1]>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(startIndex);
    api.scrollTo(startIndex, true);
  }, [api, startIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </DialogTitle>
          <DialogClose>
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>

        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image.id}>
                <div className="relative flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
                  <img
                    src={`/api/images/${image.filePath}`}
                    alt={image.filename}
                    className="max-h-[70vh] object-contain"
                  />
                </div>
                <div className="text-center mt-2 text-xs text-muted-foreground">
                  {index + 1} / {images.length} · {image.width}×{image.height}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>

        <div className="text-center text-xs text-muted-foreground">
          {current + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
}
