import { Image } from "@/components/img";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
      width={5472}
      height={3648}
      alt="Nike snicker"
    />
  );
}
