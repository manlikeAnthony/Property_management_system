import type { Property } from "@/types/property";
import type { User } from "@/types/user";

export const mockProperties: Property[] = [
  {
    _id: "prop-1",
    title: "Skyline Penthouse",
    description:
      "Four-bedroom sale listing with a private terrace and city views.",
    price: 245000000,
    currency: "NGN",
    type: "SALE",
    status: "AVAILABLE",
    address: {
      street: "12 Crescent Road",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    formattedAddress: "12 Crescent Road, Lagos, Nigeria",
    bedrooms: 4,
    bathrooms: 5,
    area: 380,
    images: [
      {
        url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
        key: "skyline-1",
      },
    ],
    isPublished: true,
    maxTenants: 1,
  },
  {
    _id: "prop-2",
    title: "Garden Court Residence",
    description:
      "Three-bedroom rental apartment with shared amenities and concierge access.",
    price: 2400000,
    currency: "NGN",
    type: "RENT",
    status: "RENTED",
    address: {
      street: "88 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
    },
    formattedAddress: "88 Admiralty Way, Lekki, Nigeria",
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        key: "garden-1",
      },
    ],
    isPublished: true,
    maxTenants: 4,
  },
];

export const mockCurrentUser: User = {
  _id: "user-1",
  name: "Adele Okafor",
  email: "adele@homify.app",
  roles: ["ADMIN"],
  accountStatus: "ACTIVE",
  isVerified: true,
  landlordProfile: {
    applicationStatus: "APPROVED",
    isActiveLandlord: true,
    businessName: "Apex Estates",
  },
};

const publishedListings = mockProperties.filter(
  (property) => property.isPublished,
).length;

const availableListings = mockProperties.filter(
  (property) => property.status === "AVAILABLE",
).length;

const rentedListings = mockProperties.filter(
  (property) => property.status === "RENTED",
).length;

const saleListings = mockProperties.filter(
  (property) => property.type === "SALE",
).length;

export const dashboardStats = [
  {
    label: "Published listings",
    value: String(publishedListings),
    hint: "Entries visible in the catalog",
  },
  {
    label: "Available properties",
    value: String(availableListings),
    hint: "Listings ready for assignment",
  },
  {
    label: "Active rentals",
    value: String(rentedListings),
    hint: "Units currently occupied",
  },
  {
    label: "Sale listings",
    value: String(saleListings),
    hint: "Properties marked for sale",
  },
];
