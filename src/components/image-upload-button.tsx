import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/react";
import { ImageIcon, UploadIcon } from "lucide-react";

interface ImageUploadButtonProps {
  todoId: number;
  onUploadComplete?: () => void;
  disabled?: boolean;
}

export function ImageUploadButton({
  todoId,
  onUploadComplete,
  disabled,
}: ImageUploadButtonProps) {
  const trpc = useTRPC();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // Get image dimensions
        const dimensions = await getImageDimensions(file);
        const contentType = file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

        // Generate presigned URL
        const presigned = await trpc.todo.generatePresignedUrl.mutate({
          todoId,
          filename: file.name,
          fileSize: file.size,
          contentType,
          width: dimensions.width,
          height: dimensions.height,
        });

        // Upload to S3
        const formData = new FormData();
        Object.entries(presigned.fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", file);

        const uploadResponse = await fetch(presigned.url, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        // Attach to todo
        await trpc.todo.attachImageToTodo.mutate({
          todoId,
          filePath: presigned.filePath,
          filename: file.name,
          fileSize: file.size,
          contentType,
          width: dimensions.width,
          height: dimensions.height,
        });
      }

      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || uploading}
        aria-label="Upload images"
      >
        {uploading ? (
          <Spinner className="size-4" />
        ) : (
          <ImageIcon className="size-4" />
        )}
      </Button>
    </>
  );
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
