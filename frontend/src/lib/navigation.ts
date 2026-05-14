import type { UserRole } from "@/types/user";

export const publicNavLinks = [
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const dashboardNavLinks = {
  USER: [
    { label: "Dashboard", href: "/dashboard/user" },
    { label: "Profile", href: "/dashboard/user/profile" },
    { label: "Current User", href: "/dashboard/user/current" },
    { label: "Become Landlord", href: "/dashboard/user/become-landlord" },
    { label: "Landlord Profile", href: "/dashboard/user/landlord-profile" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Landlords", href: "/dashboard/admin/landlords" },
    { label: "Applications", href: "/dashboard/admin/landlord-applications" },
    { label: "Properties", href: "/dashboard/admin/properties" },
  ],
  LANDLORD: [
    { label: "Dashboard", href: "/dashboard/landlord" },
    { label: "Properties", href: "/dashboard/landlord/my-properties" },
    { label: "Create Property", href: "/dashboard/landlord/create-property" },
  ],
} satisfies Record<UserRole, { label: string; href: string }[]>;

export const authLinks = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];
