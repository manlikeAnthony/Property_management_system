import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";

type PropertyGalleryProps = {
  property: Property;
};

export const PropertyGallery = ({ property }: PropertyGalleryProps) => {
  const images = useMemo(
    () =>
      property.images.length
        ? property.images.map((image) => image.url)
        : [
            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
          ],
    [property.images],
  );
  const [index, setIndex] = useState(0);

  const previous = () =>
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  const next = () =>
    setIndex((current) => (current === images.length - 1 ? 0 : current + 1));

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
        <img
          src={images[index]}
          alt={property.title}
          className="h-[22rem] w-full object-cover md:h-[32rem]"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-slate-950/70 to-transparent p-4">
          <p className="text-sm text-white/80">
            {index + 1} / {images.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={previous}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={next}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            className={
              imageIndex === index
                ? "overflow-hidden rounded-2xl ring-2 ring-primary"
                : "overflow-hidden rounded-2xl opacity-80 transition hover:opacity-100"
            }
            onClick={() => setIndex(imageIndex)}
          >
            <img
              src={image}
              alt={`${property.title} ${imageIndex + 1}`}
              className="h-24 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
