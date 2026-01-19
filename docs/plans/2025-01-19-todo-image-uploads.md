# Todo Image Uploads Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add S3 presigned URL image uploads to todos with gallery view and carousel dialog

**Architecture:** Direct browser-to-S3 uploads with presigned URLs, database tracks metadata, React components for gallery/carousel using existing shadcn/ui primitives

**Tech Stack:** AWS SDK S3, tRPC, React Query, Tailwind, shadcn/ui components (Dialog, Carousel, Button, AspectRatio, ScrollArea)

---

### Task 1: Create configuration file

**Files:**
- Create: `src/config.ts`

**Step 1: Write configuration file**

```typescript
export const UPLOAD_CONFIG = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ] as const,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
} as const;

export type AllowedMimeType = (typeof UPLOAD_CONFIG.ALLOWED_MIME_TYPES)[number];
```

**Step 2: Commit**

```bash
git add src/config.ts
git commit -m "feat: add upload configuration"
```

---

### Task 2: Create database schema for todo_images

**Files:**
- Create: `src/server/db/schema/todo-images.ts`
- Modify: `src/server/db/schema/todos.ts` (import the new schema)

**Step 1: Write the schema file**

```typescript
import {
  bigint,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const todoImagesTable = pgTable("todo_images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todoId: integer()
    .notNull()
    .references(() => todosTable.id, { onDelete: "cascade" }),
  filename: varchar({ length: 255 }).notNull(),
  filePath: varchar({ length: 500 }).notNull(),
  fileSize: bigint({ mode: "number" }).notNull(),
  contentType: varchar({ length: 100 }).notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
```

**Step 2: Export from schema index**

Modify `src/server/db/schema/todos.ts` to export both tables:

```typescript
// Add at the top
import { todoImagesTable } from "./todo-images";

// Export both
export { todosTable, todoImagesTable };
```

**Step 3: Commit**

```bash
git add src/server/db/schema/
git commit -m "feat: add todo_images database schema"
```

**Step 4: Run database migration**

```bash
npm run db:push
```

**Step 5: Commit migration**

```bash
git add drizzle/
git commit -m "chore: push todo_images table to database"
```

---

### Task 3: Create S3 presigned URL utility

**Files:**
- Create: `src/server/s3/presigned.ts`
- Modify: `src/server/s3.ts` (add the new utility import)

**Step 1: Write presigned URL utility**

```typescript
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "../s3";
import { env } from "@/env";

export interface PresignedPostResult {
  url: string;
  fields: Record<string, string>;
  filePath: string;
}

export async function generatePresignedUploadUrl(params: {
  filename: string;
  contentType: string;
  fileSize: number;
}): Promise<PresignedPostResult> {
  const date = new Date().toISOString().split("T")[0];
  const uuid = crypto.randomUUID().split("-")[0];
  const extension = filename.split(".").pop();
  const key = `upload/${date}/${uuid}.${extension}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Conditions: [
      ["eq", "$Content-Type", params.contentType],
      ["content-length-range", 0, params.fileSize],
    ],
    Fields: {
      "Content-Type": params.contentType,
    },
    Expires: 900, // 15 minutes
  });

  return { url, fields, filePath: key };
}
```

**Step 2: Export from s3/index**

Modify `src/server/s3.ts`:

```typescript
// Add at the top
export * from "./s3/presigned";
```

**Step 3: Commit**

```bash
git add src/server/s3/
git commit -m "feat: add S3 presigned URL generation utility"
```

---

### Task 4: Add generatePresignedUrl tRPC mutation

**Files:**
- Modify: `src/server/api/routers/todos.ts`

**Step 1: Write the mutation**

Add to `todosRouter`:

```typescript
generatePresignedUrl: publicProcedure
  .input(
    z.object({
      todoId: z.number(),
      filename: z.string(),
      fileSize: z.number(),
      contentType: z.enum(UPLOAD_CONFIG.ALLOWED_MIME_TYPES),
      width: z.number(),
      height: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Validate todo exists
    const [todo] = await ctx.db
      .select({ id: todosTable.id })
      .from(todosTable)
      .where(eq(todosTable.id, input.todoId))
      .limit(1);

    if (!todo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Todo not found",
      });
    }

    // Validate file size
    if (input.fileSize > UPLOAD_CONFIG.MAX_IMAGE_SIZE) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `File size exceeds maximum of ${UPLOAD_CONFIG.MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      });
    }

    // Generate presigned URL
    const result = await generatePresignedUploadUrl({
      filename: input.filename,
      contentType: input.contentType,
      fileSize: input.fileSize,
    });

    return result;
  }),
```

**Step 2: Commit**

```bash
git add src/server/api/routers/todos.ts
git commit -m "feat: add generatePresignedUrl tRPC mutation"
```

---

### Task 5: Add attachImageToTodo tRPC mutation

**Files:**
- Modify: `src/server/api/routers/todos.ts`

**Step 1: Write the mutation**

Add to `todosRouter`:

```typescript
attachImageToTodo: publicProcedure
  .input(
    z.object({
      todoId: z.number(),
      filePath: z.string(),
      filename: z.string(),
      fileSize: z.number(),
      contentType: z.string(),
      width: z.number(),
      height: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const [image] = await ctx.db
      .insert(todoImagesTable)
      .values({
        todoId: input.todoId,
        filename: input.filename,
        filePath: input.filePath,
        fileSize: input.fileSize,
        contentType: input.contentType,
        width: input.width,
        height: input.height,
      })
      .returning();

    return image;
  }),
```

**Step 2: Commit**

```bash
git add src/server/api/routers/todos.ts
git commit -m "feat: add attachImageToTodo tRPC mutation"
```

---

### Task 6: Add deleteImage tRPC mutation

**Files:**
- Modify: `src/server/api/routers/todos.ts`

**Step 1: Write the mutation**

Add to `todosRouter`:

```typescript
deleteImage: publicProcedure
  .input(z.object({ imageId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(todoImagesTable)
      .where(eq(todoImagesTable.id, input.imageId));

    return { success: true };
  }),
```

**Step 2: Commit**

```bash
git add src/server/api/routers/todos.ts
git commit -m "feat: add deleteImage tRPC mutation"
```

---

### Task 7: Modify list query to include images

**Files:**
- Modify: `src/server/api/routers/todos.ts`

**Step 1: Update the list mutation**

Replace the existing `list` query with:

```typescript
list: publicProcedure.query(async ({ ctx }) => {
  const todos = await ctx.db
    .select({
      id: todosTable.id,
      title: todosTable.title,
      completed: todosTable.completed,
      createdAt: todosTable.createdAt,
      images: {
        id: todoImagesTable.id,
        filename: todoImagesTable.filename,
        filePath: todoImagesTable.filePath,
        fileSize: todoImagesTable.fileSize,
        contentType: todoImagesTable.contentType,
        width: todoImagesTable.width,
        height: todoImagesTable.height,
        createdAt: todoImagesTable.createdAt,
      },
    })
    .from(todosTable)
    .leftJoin(todoImagesTable, eq(todosTable.id, todoImagesTable.todoId))
    .orderBy(desc(todosTable.createdAt));

  // Group images by todo
  const todosWithImages = todos.reduce<
    Record<number, typeof todos[0] & { images: (typeof todos[0].images)[] }>
  >((acc, row) => {
    if (!acc[row.id]) {
      acc[row.id] = {
        id: row.id,
        title: row.title,
        completed: row.completed,
        createdAt: row.createdAt,
        images: [],
      };
    }
    if (row.images.id) {
      acc[row.id].images.push(row.images);
    }
    return acc;
  }, {});

  return Object.values(todosWithImages);
}),
```

**Step 2: Add missing imports**

Add these imports at the top of the file:

```typescript
import { desc } from "drizzle-orm";
```

**Step 3: Commit**

```bash
git add src/server/api/routers/todos.ts
git commit -m "feat: modify list query to include images"
```

---

### Task 8: Create ImageUploadButton component

**Files:**
- Create: `src/components/image-upload-button.tsx`

**Step 1: Write the component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/image-upload-button.tsx
git commit -m "feat: add ImageUploadButton component"
```

---

### Task 9: Create TodoImageGallery component

**Files:**
- Create: `src/components/todo-image-gallery.tsx`

**Step 1: Write the component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/todo-image-gallery.tsx
git commit -m "feat: add TodoImageGallery component"
```

---

### Task 10: Create ImageCarouselDialog component

**Files:**
- Create: `src/components/image-carousel-dialog.tsx`

**Step 1: Write the component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/image-carousel-dialog.tsx
git commit -m "feat: add ImageCarouselDialog component"
```

---

### Task 11: Add image API route for serving images

**Files:**
- Create: `src/routes/api/images/[...path].tsx`

**Step 1: Write the API route**

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";

export const Route = createFileRoute("/api/images/$")({
  loader: async ({ params }) => {
    const path = params._;

    // Construct S3 public URL if configured
    if (env.S3_PUBLIC_URL) {
      return new URL(path, env.S3_PUBLIC_URL).toString();
    }

    // Otherwise, redirect to S3 endpoint with path-style access
    return new URL(
      path,
      `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}`
    ).toString();
  },
});
```

**Step 2: Commit**

```bash
git add src/routes/api/images/
git commit -m "feat: add image proxy API route"
```

---

### Task 12: Integrate components into todo list

**Files:**
- Modify: `src/routes/todos.tsx`

**Step 1: Import new components**

Add at the top with other imports:

```typescript
import { ImageUploadButton } from "@/components/image-upload-button";
import { TodoImageGallery } from "@/components/todo-image-gallery";
import { ImageCarouselDialog } from "@/components/image-carousel-dialog";
```

**Step 2: Add carousel state**

Add after existing state declarations:

```typescript
  const [selectedTodoImages, setSelectedTodoImages] = React.useState<{
    todoId: number;
    images: typeof todos[number]["images"];
    startIndex: number;
  } | null>(null);
```

**Step 3: Add image click handler**

Add after other handler functions:

```typescript
  const handleImageClick = (todoId: number, images: typeof todos[number]["images"], index: number) => {
    setSelectedTodoImages({ todoId, images, startIndex: index });
  };
```

**Step 4: Add upload refetch handler**

Add after other handler functions:

```typescript
  const handleUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey });
  };
```

**Step 5: Integrate components into todo item**

Modify the todo item `li` element to include image gallery and upload button. Find the section that renders the todo items and add:

```tsx
<div className="flex flex-1 flex-col gap-2">
  <span className="flex flex-1 flex-col gap-1">
    <span
      className={
        "text-sm font-medium transition" +
        (todo.completed
          ? "text-muted-foreground line-through"
          : "text-foreground")
      }
    >
      {todo.title}
    </span>
    <span className="text-xs text-muted-foreground">
      {todo.completed ? "Completed" : "Created"} ·{" "}
      {createdLabel}
    </span>
  </span>

  {/* Add image gallery if todo has images */}
  {todo.images && todo.images.length > 0 && (
    <TodoImageGallery
      images={todo.images}
      onImageClick={(index) => handleImageClick(todo.id, todo.images, index)}
    />
  )}
</div>

<div className="flex items-center gap-2">
  {/* Add upload button before delete button */}
  <ImageUploadButton
    todoId={todo.id}
    onUploadComplete={handleUploadComplete}
  />

  {todo.completed && (
    <CheckCircle2Icon className="size-4 text-primary" />
  )}
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    onClick={() => deleteMutation.mutate({ id: todo.id })}
    aria-label="Delete todo"
  >
    <Trash2Icon className="size-4" />
  </Button>
</div>
```

**Step 6: Add carousel dialog at the end of component**

Add before the closing `</div>` of RouteComponent:

```tsx
{/* Image carousel dialog */}
{selectedTodoImages && (
  <ImageCarouselDialog
    open={!!selectedTodoImages}
    onOpenChange={(open) => !open && setSelectedTodoImages(null)}
    images={selectedTodoImages.images}
    startIndex={selectedTodoImages.startIndex}
  />
)}
```

**Step 7: Commit**

```bash
git add src/routes/todos.tsx
git commit -m "feat: integrate image upload components into todo list"
```

---

### Task 13: Test the implementation

**Step 1: Start development server**

```bash
npm run dev
```

**Step 2: Manual testing checklist**

1. Create a new todo
2. Click the image upload button on the todo
3. Select multiple images (JPG, PNG, WebP)
4. Verify images appear in the gallery
5. Click on an image to open the carousel
6. Navigate between images using arrows
7. Verify image dimensions are displayed
8. Try uploading a file > 10MB (should fail with error)
9. Try uploading a non-image file (should be rejected)
10. Delete a todo with images
11. Verify images are removed from database

**Step 3: Run linter**

```bash
npm run lint
```

**Step 4: Commit final changes**

```bash
git add .
git commit -m "test: verify image upload functionality"
```

---

### Task 14: Clean up worktree (when ready)

**Step 1: Push changes to remote**

```bash
git push -u origin feature/todo-image-uploads
```

**Step 2: Return to main repository**

```bash
cd ../..
```

**Step 3: Remove worktree when done**

```bash
git worktree remove .worktrees/feature-todo-image-uploads
```

---

## Summary

This implementation plan creates a complete image upload system for todos using S3 presigned URLs, with:

- Database schema for tracking image metadata
- tRPC mutations for generating presigned URLs and attaching images
- Frontend components for uploading, displaying, and viewing images
- Integration with existing todo list UI
- Error handling and validation

Total estimated implementation time: ~60-90 minutes
Total commits: 14
