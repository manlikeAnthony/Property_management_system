import {
  BedDouble,
  CalendarDays,
  MapPin,
  ShowerHead,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
  compact?: boolean;
};

const propertyStatusTone: Record<Property["status"], string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  SOLD: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  RENTED: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  PARTIALLY_OCCUPIED: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

export const PropertyCard = ({ property, compact }: PropertyCardProps) => {
  const heroImage =
    property.images?.[0]?.url ??
    `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80`;

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="group overflow-hidden border-border/60 bg-card/90 transition-all duration-200 hover:shadow-glow">
        <Link to={`/properties/${property._id}`} className="block">
          <div className="relative overflow-hidden">
            <img
              src={heroImage}
              alt={property.title}
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge className={propertyStatusTone[property.status]}>
                {property.status}
              </Badge>
              <Badge className="bg-slate-950/60 text-white backdrop-blur">
                {property.type}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  {property.address.city}, {property.address.state}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{property.title}</h3>
              </div>
              <p className="text-right text-2xl font-semibold">
                {formatCurrency(property.price, property.currency)}
              </p>
            </div>
          </div>

          <CardContent className="space-y-4 p-5">
            <p
              className={
                compact
                  ? "line-clamp-2 text-sm text-muted-foreground"
                  : "text-sm text-muted-foreground"
              }
            >
              {property.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                <MapPin className="h-4 w-4" />
                {property.formattedAddress ??
                  `${property.address.street}, ${property.address.city}`}
              </span>
              {property.bedrooms !== undefined ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <BedDouble className="h-4 w-4" />
                  {property.bedrooms} beds
                </span>
              ) : null}
              {property.bathrooms !== undefined ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <ShowerHead className="h-4 w-4" />
                  {property.bathrooms} baths
                </span>
              ) : null}
              {property.createdAt ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(property.createdAt)}
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="mr-2 inline h-4 w-4 text-primary" />
                {property.isPublished ? "Published" : "Draft"}
              </p>
              <span className="text-sm font-medium text-primary">
                View property
              </span>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.article>
  );
};
