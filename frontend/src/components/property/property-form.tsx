import {
  BadgeDollarSign,
  CheckCircle2,
  Loader2,
  ImageUp,
  MapPinned,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PropertyFormValues } from "@/types/property";

type PropertyFormProps = {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (values: PropertyFormValues) => void | Promise<void>;
  submitLabel?: string;
  previewImageUrl?: string;
  requireImages?: boolean;
};

const createPropertySchema = (requireImages: boolean) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
    price: z
      .number({ error: "Price must be a number" })
      .positive({ message: "Price must be a positive number" }),
    type: z.enum(["SALE", "RENT"]),
    bedrooms: z
      .number({ error: "Bedrooms must be a number" })
      .int("Bedrooms must be a whole number")
      .min(0, "Bedrooms cannot be negative")
      .optional(),
    bathrooms: z
      .number({ error: "Bathrooms must be a number" })
      .int("Bathrooms must be a whole number")
      .min(0, "Bathrooms cannot be negative")
      .optional(),
    area: z
      .number({ error: "Area must be a number" })
      .positive({ message: "Area must be a positive number" })
      .optional(),
    street: z
      .string()
      .trim()
      .min(3, "Street address must be at least 3 characters")
      .max(100, "Street address cannot exceed 100 characters"),
    city: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(50, "City cannot exceed 50 characters"),
    state: z
      .string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(50, "State cannot exceed 50 characters"),
    country: z
      .string()
      .trim()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country cannot exceed 50 characters"),
    images: requireImages
      ? z.array(z.instanceof(File)).min(1, "Add at least one image")
      : z.array(z.instanceof(File)).default([]),
  });

type PropertyFormSchema = ReturnType<typeof createPropertySchema>;
type PropertyFormInput = z.input<PropertyFormSchema>;
type PropertyFormOutput = z.output<PropertyFormSchema>;

const getDefaultValues = (
  defaultValues?: Partial<PropertyFormValues>,
): PropertyFormInput => ({
  title: defaultValues?.title ?? "",
  description: defaultValues?.description ?? "",
  price: defaultValues?.price ?? 0,
  type: defaultValues?.type ?? "SALE",
  bedrooms:
    defaultValues?.bedrooms === undefined || defaultValues?.bedrooms === null
      ? undefined
      : defaultValues.bedrooms,
  bathrooms:
    defaultValues?.bathrooms === undefined || defaultValues?.bathrooms === null
      ? undefined
      : defaultValues.bathrooms,
  area:
    defaultValues?.area === undefined || defaultValues?.area === null
      ? undefined
      : defaultValues.area,
  street: defaultValues?.street ?? "",
  city: defaultValues?.city ?? "",
  state: defaultValues?.state ?? "",
  country: defaultValues?.country ?? "Nigeria",
  images: defaultValues?.images ?? [],
});

const SectionCard = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <Card className="border-border/60 bg-card/90 shadow-soft">
    <CardHeader className="border-b border-border/60 bg-muted/10 px-6 py-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-primary/15 bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="mt-1 max-w-2xl">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 px-6 py-5">{children}</CardContent>
  </Card>
);

const FieldLabel = ({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) => (
  <label className="flex items-center gap-1 text-sm font-medium text-foreground">
    <span>{children}</span>
    {required ? <span className="text-destructive">*</span> : null}
  </label>
);

const FieldHint = ({ children }: { children: string }) => (
  <p className="text-xs text-muted-foreground">{children}</p>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-xs font-medium text-destructive">{message}</p>
  ) : null;

const PreviewChip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
    {children}
  </span>
);

export const PropertyForm = ({
  defaultValues,
  onSubmit,
  submitLabel = "Save property",
  previewImageUrl,
  requireImages = true,
}: PropertyFormProps) => {
  const schema = useMemo(
    () => createPropertySchema(requireImages),
    [requireImages],
  );

  const form = useForm<PropertyFormInput, undefined, PropertyFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(defaultValues),
    mode: "onTouched",
  });

  const values =
    useWatch({ control: form.control }) ?? getDefaultValues(defaultValues);
  const selectedImages = values.images ?? [];
  const [heroPreview, setHeroPreview] = useState<string>(previewImageUrl ?? "");
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    const primaryFile = selectedImages[0];

    if (primaryFile) {
      const objectUrl = URL.createObjectURL(primaryFile);
      setHeroPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setHeroPreview(previewImageUrl ?? "");
    return undefined;
  }, [previewImageUrl, selectedImages[0]]);

  useEffect(() => {
    form.reset(getDefaultValues(defaultValues));
  }, [defaultValues, form]);

  const title = values.title?.trim() || "Untitled property";
  const city = values.city?.trim() || "Add a city";
  const state = values.state?.trim() || "state";
  const country = values.country?.trim() || "country";
  const priceText = values.price
    ? formatCurrency(values.price, "NGN")
    : "Set a price";

  const handleSubmit: SubmitHandler<PropertyFormOutput> = async (
    submittedValues,
  ) => {
    await onSubmit(submittedValues);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <SectionCard
          icon={Sparkles}
          title="Basic information"
          description="Give the listing a clear identity. This is the first thing buyers or tenants will see."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <FieldLabel required>Property title</FieldLabel>
              <Input
                placeholder="3-bedroom duplex in Lekki"
                aria-invalid={Boolean(form.formState.errors.title)}
                {...form.register("title")}
              />
              <FieldHint>Keep it short, specific, and easy to scan.</FieldHint>
              <FieldError message={form.formState.errors.title?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel required>Listing type</FieldLabel>
              <Select
                aria-invalid={Boolean(form.formState.errors.type)}
                {...form.register("type")}
              >
                <option value="SALE">For sale</option>
                <option value="RENT">For rent</option>
              </Select>
              <FieldHint>
                Choose the primary commercial intent for this property.
              </FieldHint>
              <FieldError message={form.formState.errors.type?.message} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Describe the layout, standout features, and anything that helps someone picture the home."
                className="min-h-40"
                aria-invalid={Boolean(form.formState.errors.description)}
                {...form.register("description")}
              />
              <FieldHint>
                Up to 1,000 characters. Mention features, finishes, and
                surrounding conveniences.
              </FieldHint>
              <FieldError
                message={form.formState.errors.description?.message}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={BadgeDollarSign}
          title="Pricing and details"
          description="Set the commercial terms and the key sizing details that drive filtering and decision-making."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2 md:col-span-2 xl:col-span-1">
              <FieldLabel required>Price</FieldLabel>
              <div className="flex items-center overflow-hidden rounded-2xl border border-border/70 bg-background/80 shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                <span className="border-r border-border/60 bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
                  NGN
                </span>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="150000000"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-invalid={Boolean(form.formState.errors.price)}
                  {...form.register("price", {
                    setValueAs: (value) => (value === "" ? 0 : Number(value)),
                  })}
                />
              </div>
              <FieldHint>
                Enter the asking price in naira. The preview updates instantly.
              </FieldHint>
              <FieldError message={form.formState.errors.price?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel>Bedrooms</FieldLabel>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="4"
                aria-invalid={Boolean(form.formState.errors.bedrooms)}
                {...form.register("bedrooms", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
              <FieldHint>
                Optional. Leave blank if the count does not apply.
              </FieldHint>
              <FieldError message={form.formState.errors.bedrooms?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel>Bathrooms</FieldLabel>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="3"
                aria-invalid={Boolean(form.formState.errors.bathrooms)}
                {...form.register("bathrooms", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
              <FieldHint>Optional. Use whole numbers only.</FieldHint>
              <FieldError message={form.formState.errors.bathrooms?.message} />
            </div>

            <div className="space-y-2 md:col-span-2 xl:col-span-1">
              <FieldLabel>Area</FieldLabel>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="240"
                aria-invalid={Boolean(form.formState.errors.area)}
                {...form.register("area", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
              <FieldHint>
                Optional. Use square meters so the size is easy to compare.
              </FieldHint>
              <FieldError message={form.formState.errors.area?.message} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={MapPinned}
          title="Address and location"
          description="Capture a complete physical address so the backend can geocode and place the listing correctly."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <FieldLabel required>Street address</FieldLabel>
              <Input
                placeholder="12 Admiralty Road"
                aria-invalid={Boolean(form.formState.errors.street)}
                {...form.register("street")}
              />
              <FieldHint>
                Use the full street or road name, not a nickname.
              </FieldHint>
              <FieldError message={form.formState.errors.street?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel required>City</FieldLabel>
              <Input
                placeholder="Lekki"
                aria-invalid={Boolean(form.formState.errors.city)}
                {...form.register("city")}
              />
              <FieldError message={form.formState.errors.city?.message} />
            </div>

            <div className="space-y-2">
              <FieldLabel required>State</FieldLabel>
              <Input
                placeholder="Lagos"
                aria-invalid={Boolean(form.formState.errors.state)}
                {...form.register("state")}
              />
              <FieldError message={form.formState.errors.state?.message} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <FieldLabel required>Country</FieldLabel>
              <Input
                placeholder="Nigeria"
                aria-invalid={Boolean(form.formState.errors.country)}
                {...form.register("country")}
              />
              <FieldHint>
                Defaults to Nigeria, but can be changed for listings outside the
                country.
              </FieldHint>
              <FieldError message={form.formState.errors.country?.message} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={ImageUp}
          title="Images"
          description="Upload the first set of images that will represent the property across search and detail views."
        >
          <Dropzone
            files={selectedImages}
            onFilesChange={(files) =>
              form.setValue("images", files, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
          <FieldHint>
            {requireImages
              ? "At least one image is required before you can save the listing."
              : "You can save changes without adding new images."}
          </FieldHint>
          {selectedImages.length > 0 ? (
            <p className="text-xs font-medium text-foreground/80">
              {selectedImages.length} image
              {selectedImages.length > 1 ? "s" : ""} selected
            </p>
          ) : null}
          <FieldError
            message={
              form.formState.errors.images?.message as string | undefined
            }
          />
        </SectionCard>

        <Card className="border-border/60 bg-card/90 shadow-soft">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Save workflow
              </p>
              <p className="text-sm text-muted-foreground">
                Listings are created as drafts while the backend stores the
                property, uploads images, and prepares location data.
              </p>
            </div>
            <Button
              type="submit"
              className="min-w-44"
              disabled={
                isSubmitting || (requireImages && selectedImages.length === 0)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="space-y-6 lg:sticky lg:top-24 h-fit">
        <Card className="overflow-hidden border-border/60 bg-card/90 shadow-soft">
          <div className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Live preview
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  What the listing feels like
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Draft
              </span>
            </div>
          </div>

          <CardContent className="space-y-5 p-6">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted/20">
              {heroPreview ? (
                <img
                  src={heroPreview}
                  alt={title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 text-center text-white/80">
                  <div>
                    <Sparkles className="mx-auto h-10 w-10 text-primary" />
                    <p className="mt-3 text-sm font-medium">
                      Add an image to preview the listing cover
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Your selected cover image will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {city}, {state}
                  </p>
                  <h4 className="mt-1 text-2xl font-semibold tracking-tight">
                    {title}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Price
                  </p>
                  <p className="text-xl font-semibold text-primary">
                    {priceText}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <PreviewChip>
                  {values.type === "RENT" ? "For rent" : "For sale"}
                </PreviewChip>
                <PreviewChip>NGN pricing</PreviewChip>
                <PreviewChip>{country}</PreviewChip>
                <PreviewChip>Draft on save</PreviewChip>
              </div>

              <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                {values.description?.trim() ||
                  "A short description appears here as you type. Use it to frame the space, audience, and standout features."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {values.street?.trim() || "Street address"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {city}, {state}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Property mix
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {values.bedrooms ?? "—"} bedrooms
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {values.bathrooms ?? "—"} bathrooms
                    {values.area ? ` · ${values.area} sqm` : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-soft">
          <CardContent className="space-y-3 p-6">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Backend-aware workflow
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • New listings are created as drafts, then processed with
                uploaded images and location geocoding.
              </li>
              <li>
                • Required fields mirror the API, so validation errors are
                caught before submission.
              </li>
              <li>
                • Update mode keeps the same structure without forcing a new
                image upload.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
