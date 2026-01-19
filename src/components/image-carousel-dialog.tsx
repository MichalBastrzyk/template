import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(startIndex);
    api.scrollTo(startIndex, true);
  }, [api, startIndex]);

  const handleSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </DialogTitle>
          <DialogHeader.Close asChild>
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <XIcon />
            </Button>
          </DialogHeader.Close>
        </DialogHeader>

        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "center",
            loop: true,
          }}
          onSelect={handleSelect}
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
