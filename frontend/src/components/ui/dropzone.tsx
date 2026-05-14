import { UploadCloud, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DropzoneProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
};

export const Dropzone = ({
  files,
  onFilesChange,
  multiple = true,
  accept = "image/*",
  maxFiles = 10,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(
    () => () => previews.forEach(({ preview }) => URL.revokeObjectURL(preview)),
    [previews],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const next = multiple ? [...files, ...selected] : selected.slice(0, 1);
    onFilesChange(next.slice(0, maxFiles));
    event.target.value = "";
  };

  return (
    <Card className="border-dashed bg-background/70 p-4">
      <div
        className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/80 p-6 text-center transition hover:border-primary/50 hover:bg-muted/20"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const dropped = Array.from(event.dataTransfer.files ?? []);
          const next = multiple ? [...files, ...dropped] : dropped.slice(0, 1);
          onFilesChange(next.slice(0, maxFiles));
        }}
      >
        <UploadCloud className="h-9 w-9 text-primary" />
        <div>
          <p className="font-medium">Drag and drop images here</p>
          <p className="text-sm text-muted-foreground">
            or click to upload up to {maxFiles} files
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {previews.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {previews.map(({ file, preview }, index) => (
            <div
              key={`${file.name}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-muted/20"
            >
              <img
                src={preview}
                alt={file.name}
                className="h-28 w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 transition group-hover:opacity-100"
                onClick={() =>
                  onFilesChange(
                    files.filter((_, currentIndex) => currentIndex !== index),
                  )
                }
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full"
        onClick={() => inputRef.current?.click()}
      >
        Select files
      </Button>
    </Card>
  );
};
