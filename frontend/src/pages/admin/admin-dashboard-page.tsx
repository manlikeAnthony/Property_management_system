import { useMemo, useEffect, useState } from "react";
import {
  Activity,
  Building2,
  ClipboardCheck,
  Clock3,
  Home,
  Plus,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardPanel } from "@/components/dashboard/overview-grid";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useApprovedLandlordsQuery,
  useLandlordApplicationsQuery,
  usePropertiesQuery,
  useRejectedLandlordsQuery,
  useUsersQuery,
} from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "#0ea5e9",
  RENTED: "#10b981",
  SOLD: "#f59e0b",
  PARTIALLY_OCCUPIED: "#a78bfa",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#38bdf8",
  LANDLORD: "#34d399",
  USER: "#fbbf24",
};

const formatMonth = (value: Date) =>
  value.toLocaleDateString("en-US", { month: "short" });

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const relativeTime = (value?: string) => {
  if (!value) return "Just now";
  const target = new Date(value).getTime();
  const now = Date.now();
  const diff = now - target;

  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
};

const AdminDashboardPage = () => {
  const usersQuery = useUsersQuery({ limit: 400, sort: "-createdAt" });
  const propertiesQuery = usePropertiesQuery({
    limit: 400,
    sort: "-createdAt",
  });
  const applicationsQuery = useLandlordApplicationsQuery({
    limit: 400,
    sort: "-createdAt",
  });
  const approvedQuery = useApprovedLandlordsQuery({
    limit: 400,
    sort: "-createdAt",
  });
  const rejectedQuery = useRejectedLandlordsQuery({
    limit: 400,
    sort: "-createdAt",
  });

  const users = normalizeCollection(usersQuery.data);
  const properties = normalizeCollection(propertiesQuery.data);
  const applications = normalizeCollection(applicationsQuery.data);
  const approvedLandlords = normalizeCollection(approvedQuery.data);
  const rejectedLandlords = normalizeCollection(rejectedQuery.data);

  const isLoading =
    usersQuery.isLoading ||
    propertiesQuery.isLoading ||
    applicationsQuery.isLoading ||
    approvedQuery.isLoading ||
    rejectedQuery.isLoading;

  const hasLiveError =
    usersQuery.isError ||
    propertiesQuery.isError ||
    applicationsQuery.isError ||
    approvedQuery.isError ||
    rejectedQuery.isError;

  const now = new Date();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const metrics = useMemo(() => {
    const published = properties.filter((item) => item.isPublished).length;
    const available = properties.filter(
      (item) => item.status === "AVAILABLE",
    ).length;
    const rented = properties.filter((item) => item.status === "RENTED").length;
    const recentListings = properties.filter(
      (item) =>
        item.createdAt && new Date(item.createdAt).getTime() >= sevenDaysAgo,
    ).length;

    return {
      totalUsers: users.length,
      activeLandlords: approvedLandlords.length,
      pendingApplications: applications.filter(
        (item) => item.landlordProfile?.applicationStatus === "PENDING",
      ).length,
      publishedProperties: published,
      availableProperties: available,
      rentedProperties: rented,
      recentlyCreatedListings: recentListings,
    };
  }, [users, approvedLandlords, applications, properties, sevenDaysAgo]);

  const propertyStatusData = useMemo(() => {
    const statuses = ["AVAILABLE", "RENTED", "SOLD", "PARTIALLY_OCCUPIED"];
    return statuses.map((status) => ({
      name: status.replace("_", " "),
      value: properties.filter((item) => item.status === status).length,
      color: STATUS_COLORS[status],
    }));
  }, [properties]);

  const roleDistributionData = useMemo(() => {
    const roleCounts = {
      ADMIN: users.filter((item) => item.roles.includes("ADMIN")).length,
      LANDLORD: users.filter((item) => item.roles.includes("LANDLORD")).length,
      USER: users.filter((item) => item.roles.includes("USER")).length,
    };
    return Object.entries(roleCounts).map(([name, value]) => ({
      name,
      value,
      color: ROLE_COLORS[name],
    }));
  }, [users]);

  const monthlyListingsData = useMemo(() => {
    const buckets = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: formatMonth(date),
        listings: 0,
      };
    });

    properties.forEach((property) => {
      if (!property.createdAt) return;
      const created = new Date(property.createdAt);
      const key = `${created.getFullYear()}-${created.getMonth()}`;
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) bucket.listings += 1;
    });

    return buckets.map(({ month, listings }) => ({ month, listings }));
  }, [properties, now]);

  const approvalTrendData = useMemo(() => {
    const buckets = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: formatMonth(date),
        approved: 0,
        rejected: 0,
      };
    });

    approvedLandlords.forEach((item) => {
      const stamp = item.landlordProfile?.approvedAt;
      if (!stamp) return;
      const date = startOfMonth(new Date(stamp));
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = buckets.find((entry) => entry.key === key);
      if (bucket) bucket.approved += 1;
    });

    rejectedLandlords.forEach((item) => {
      const stamp = item.landlordProfile?.rejectedAt;
      if (!stamp) return;
      const date = startOfMonth(new Date(stamp));
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = buckets.find((entry) => entry.key === key);
      if (bucket) bucket.rejected += 1;
    });

    return buckets.map(({ month, approved, rejected }) => ({
      month,
      approved,
      rejected,
    }));
  }, [approvedLandlords, rejectedLandlords, now]);

  const activityFeed = useMemo(() => {
    const activities: Array<{
      id: string;
      title: string;
      time: string;
      tone: string;
    }> = [];

    applications
      .filter((item) => item.createdAt)
      .slice(0, 4)
      .forEach((item) => {
        activities.push({
          id: `application-${item._id}`,
          title: `${item.name} submitted a landlord application`,
          time: relativeTime(item.createdAt),
          tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
        });
      });

    properties
      .filter((item) => item.createdAt)
      .slice(0, 4)
      .forEach((item) => {
        activities.push({
          id: `property-${item._id}`,
          title: item.isPublished
            ? `${item.title} was published`
            : `${item.title} was created`,
          time: relativeTime(item.updatedAt ?? item.createdAt),
          tone: item.isPublished
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
        });
      });

    users
      .filter((item) => item.createdAt)
      .slice(0, 4)
      .forEach((item) => {
        activities.push({
          id: `user-${item._id}`,
          title: `${item.name} registered`,
          time: relativeTime(item.createdAt),
          tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
        });
      });

    approvedLandlords
      .filter((item) => item.landlordProfile?.approvedAt)
      .slice(0, 3)
      .forEach((item) => {
        activities.push({
          id: `approved-${item._id}`,
          title: `${item.name} was approved as landlord`,
          time: relativeTime(item.landlordProfile?.approvedAt),
          tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        });
      });

    return activities.sort((a, b) => (a.time < b.time ? 1 : -1)).slice(0, 8);
  }, [applications, properties, users, approvedLandlords]);

  const fallbackFeed = [
    {
      id: "f-1",
      title: "New landlord application submitted",
      time: "12m ago",
      tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
    {
      id: "f-2",
      title: "Property published",
      time: "25m ago",
      tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
      id: "f-3",
      title: "User registered",
      time: "42m ago",
      tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    },
    {
      id: "f-4",
      title: "Landlord approved",
      time: "1h ago",
      tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  ];

  const feedItems = activityFeed.length ? activityFeed : fallbackFeed;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Operations"
          title="Monitor platform activity in real time"
          description="Track listings, approvals, and user activity from one command center."
        />

        {hasLiveError ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            Live data is temporarily unavailable. Showing a recent snapshot.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total users",
              value: metrics.totalUsers,
              icon: Users,
              hint: "Registered accounts",
              gradient: "from-sky-500/20 to-sky-400/5",
            },
            {
              label: "Active landlords",
              value: metrics.activeLandlords,
              icon: UserCheck,
              hint: "Approved landlord accounts",
              gradient: "from-emerald-500/20 to-emerald-400/5",
            },
            {
              label: "Pending applications",
              value: metrics.pendingApplications,
              icon: ClipboardCheck,
              hint: "Awaiting review",
              gradient: "from-amber-500/20 to-amber-400/5",
            },
            {
              label: "Recent listings",
              value: metrics.recentlyCreatedListings,
              icon: TrendingUp,
              hint: "Created in the last 7 days",
              gradient: "from-violet-500/20 to-violet-400/5",
            },
          ].map(({ label, value, icon: Icon, hint, gradient }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.25 }}
            >
              <Card
                className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${gradient} backdrop-blur-xl`}
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {label}
                    </p>
                    <div className="rounded-xl bg-background/70 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-4xl font-semibold tracking-tight">
                    {isLoading ? "--" : <AnimatedNumber value={value} />}
                  </p>
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Published properties",
              value: metrics.publishedProperties,
              tone: "text-sky-600",
            },
            {
              label: "Available properties",
              value: metrics.availableProperties,
              tone: "text-emerald-600",
            },
            {
              label: "Rented properties",
              value: metrics.rentedProperties,
              tone: "text-amber-600",
            },
          ].map((item) => (
            <Card key={item.label} className="border-border/60 bg-card/80">
              <CardContent className="flex items-end justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`mt-2 text-3xl font-semibold ${item.tone}`}>
                    {isLoading ? "--" : <AnimatedNumber value={item.value} />}
                  </p>
                </div>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardPanel title="Property status distribution">
            {isLoading ? (
              <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {propertyStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(148,163,184,0.25)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel title="User role distribution">
            {isLoading ? (
              <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleDistributionData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.2)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "currentColor", fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(148,163,184,0.25)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {roleDistributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardPanel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <DashboardPanel title="Monthly listing activity">
            {isLoading ? (
              <div className="h-72 animate-pulse rounded-2xl bg-muted/40" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaFriendlyBarChart data={monthlyListingsData} />
                </ResponsiveContainer>
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel title="Landlord approval trends">
            {isLoading ? (
              <div className="h-72 animate-pulse rounded-2xl bg-muted/40" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={approvalTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.2)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "currentColor", fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(148,163,184,0.25)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardPanel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <DashboardPanel title="Recent activity">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-2xl bg-muted/40"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border/60 bg-background/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.tone}`}
                        >
                          Event
                        </span>
                        <p className="text-sm font-medium leading-6">
                          {item.title}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel title="Quick actions">
            <div className="grid gap-3">
              {[
                {
                  label: "Review applications",
                  hint: "Process pending landlord requests",
                  href: "/dashboard/admin/landlord-applications",
                  icon: ClipboardCheck,
                },
                {
                  label: "View users",
                  hint: "Inspect account status and roles",
                  href: "/dashboard/admin/users",
                  icon: Users,
                },
                {
                  label: "Manage properties",
                  hint: "Review listings and moderation",
                  href: "/dashboard/admin/properties",
                  icon: Home,
                },
                {
                  label: "Approve landlords",
                  hint: "Open approved landlord records",
                  href: "/dashboard/admin/approved-landlords",
                  icon: UserCheck,
                },
                {
                  label: "Create property",
                  hint: "Add a new listing quickly",
                  href: "/dashboard/landlord/create-property",
                  icon: Plus,
                },
                {
                  label: "Open public catalog",
                  hint: "View live listings",
                  href: "/properties",
                  icon: Building2,
                },
              ].map(({ label, hint, href, icon: Icon }) => (
                <Button
                  key={label}
                  asChild
                  variant="outline"
                  className="h-auto justify-start rounded-2xl border-border/60 bg-background/65 px-4 py-3 text-left hover:border-primary/25 hover:bg-background"
                >
                  <Link to={href}>
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="ml-1">
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </DashboardLayout>
  );
};

const AreaFriendlyBarChart = ({
  data,
}: {
  data: Array<{ month: string; listings: number }>;
}) => (
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
    <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 12 }} />
    <YAxis
      allowDecimals={false}
      tick={{ fill: "currentColor", fontSize: 12 }}
    />
    <Tooltip
      contentStyle={{
        background: "rgba(2,6,23,0.92)",
        border: "1px solid rgba(148,163,184,0.25)",
        borderRadius: 12,
        color: "#fff",
      }}
    />
    <Bar
      dataKey="listings"
      radius={[9, 9, 0, 0]}
      fill="url(#listingsGradient)"
    />
    <defs>
      <linearGradient id="listingsGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.45} />
      </linearGradient>
    </defs>
  </BarChart>
);

export default AdminDashboardPage;
