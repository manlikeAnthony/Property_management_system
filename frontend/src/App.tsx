import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { ProtectedRoute } from "@/components/route-guards/protected-route";
import { RoleRoute } from "@/components/route-guards/role-route";
import { toast } from "@/components/ui/toaster";
import { APP_NAME } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

const LandingPage = lazy(() => import("@/pages/public/landing-page"));
const AboutPage = lazy(() => import("@/pages/public/about-page"));
const ContactPage = lazy(() => import("@/pages/public/contact-page"));
const PropertiesPage = lazy(() => import("@/pages/public/properties-page"));
const PropertyDetailsPage = lazy(
  () => import("@/pages/public/property-details-page"),
);
const LoginPage = lazy(() => import("@/pages/public/login-page"));
const RegisterPage = lazy(() => import("@/pages/public/register-page"));
const VerifyEmailPage = lazy(() => import("@/pages/public/verify-email-page"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/public/forgot-password-page"),
);
const ResetPasswordPage = lazy(
  () => import("@/pages/public/reset-password-page"),
);
const NotFoundPage = lazy(() => import("@/pages/public/not-found-page"));
const UserDashboardPage = lazy(
  () => import("@/pages/user/user-dashboard-page"),
);
const UserProfilePage = lazy(() => import("@/pages/user/user-profile-page"));
const CurrentUserPage = lazy(() => import("@/pages/user/current-user-page"));
const BecomeLandlordPage = lazy(
  () => import("@/pages/user/become-landlord-page"),
);
const MyLandlordProfilePage = lazy(
  () => import("@/pages/user/my-landlord-profile-page"),
);
const OwnershipHistoryPage = lazy(
  () => import("@/pages/user/ownership-history-page"),
);
const PurchasePropertyPage = lazy(
  () => import("@/pages/user/purchase-property-page"),
);
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/admin-dashboard-page"),
);
const AllUsersPage = lazy(() => import("@/pages/admin/all-users-page"));
const SingleUserPage = lazy(() => import("@/pages/admin/single-user-page"));
const AllLandlordsPage = lazy(() => import("@/pages/admin/all-landlords-page"));
const LandlordApplicationsPage = lazy(
  () => import("@/pages/admin/landlord-applications-page"),
);
const ApprovedLandlordsPage = lazy(
  () => import("@/pages/admin/approved-landlords-page"),
);
const RejectedLandlordsPage = lazy(
  () => import("@/pages/admin/rejected-landlords-page"),
);
const PropertyManagementPage = lazy(
  () => import("@/pages/admin/property-management-page"),
);
const LandlordDashboardPage = lazy(
  () => import("@/pages/landlord/landlord-dashboard-page"),
);
const CreatePropertyPage = lazy(
  () => import("@/pages/landlord/create-property-page"),
);
const UpdatePropertyPage = lazy(
  () => import("@/pages/landlord/update-property-page"),
);
const DeletePropertyPage = lazy(
  () => import("@/pages/landlord/delete-property-page"),
);
const MyListedPropertiesPage = lazy(
  () => import("@/pages/landlord/my-listed-properties-page"),
);

const App = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const dashboardRoute = user?.roles.includes("ADMIN")
    ? "/dashboard/admin"
    : user?.roles.includes("LANDLORD")
      ? "/dashboard/landlord"
      : "/dashboard/user";

  useEffect(() => {
    const handler = () => {
      toast.info("Session expired", "Please sign in again to continue.");
      navigate("/login", { replace: true });
    };

    window.addEventListener("homify:session-expired", handler);
    return () => window.removeEventListener("homify:session-expired", handler);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
            Loading {APP_NAME}...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/current"
            element={
              <ProtectedRoute>
                <CurrentUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/become-landlord"
            element={
              <ProtectedRoute>
                <BecomeLandlordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/landlord-profile"
            element={
              <ProtectedRoute>
                <MyLandlordProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/ownership-history/:id"
            element={
              <ProtectedRoute>
                <OwnershipHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/purchase/:id"
            element={
              <ProtectedRoute>
                <PurchasePropertyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/users"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AllUsersPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/users/:id"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <SingleUserPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/landlords"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AllLandlordsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/landlord-applications"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <LandlordApplicationsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/approved-landlords"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <ApprovedLandlordsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/rejected-landlords"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <RejectedLandlordsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/admin/properties"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <PropertyManagementPage />
              </RoleRoute>
            }
          />

          <Route
            path="/dashboard/landlord"
            element={
              <RoleRoute roles={["LANDLORD", "ADMIN"]}>
                <LandlordDashboardPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/landlord/create-property"
            element={
              <RoleRoute roles={["LANDLORD", "ADMIN"]}>
                <CreatePropertyPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/landlord/update-property/:id"
            element={
              <RoleRoute roles={["LANDLORD", "ADMIN"]}>
                <UpdatePropertyPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/landlord/delete-property/:id"
            element={
              <RoleRoute roles={["LANDLORD", "ADMIN"]}>
                <DeletePropertyPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard/landlord/my-properties"
            element={
              <RoleRoute roles={["LANDLORD", "ADMIN"]}>
                <MyListedPropertiesPage />
              </RoleRoute>
            }
          />

          <Route
            path="/dashboard"
            element={<Navigate to={dashboardRoute} replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
